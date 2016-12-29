const express = require('express');
const mongoose = require('mongoose');
const port = 8080;
const Users =  require('./models/users');
const Projects = require('./models/projects');
const Companies = require('./models/companies');
const Tasks = require('./models/tasks');
const fs = require('fs');

const app = express();
app.use(express.static('dist'));

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

const mongoUrl = 'mongodb://localhost:27017/test';
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   let testTask = new Tasks({ title: 'test' });
//   testTask.save(() => {
//     console.log('ok');
//   });
//   console.log('we are connected');
// });


app.get('/*', (req, res) => {
  let layout = fs.readFileSync('dist/index.html', 'utf-8');
  res.send(layout);
});

const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.on('reqRegistration', (data) => {
    Users.find({
      account: {
        login: data.login,
        password: data.password
      }
    }, (err, user) => {
      if(user.length) {
        console.log('user already registered');
        socket.emit('resRegistration', { message: 'failed' });
      } else {
        console.log(user);
        const newUser = new Users({
          name: data.login,
          account: {
            login: data.login,
            password: data.password
          }
        });
        newUser.save((err, createdUser) => {
          console.log('user created successfully');
          const resolveUser = {
            name: createdUser.name,
            account: {
              login: createdUser.account.login,
              password: createdUser.account.password
            },
            message: 'success',
            id: createdUser.id
          };
          socket.emit('resRegistration', resolveUser);
        });
      }
    });
  });
  socket.on('reqLogin', (data) => {
    Users.find({
      account: {
        login: data.login,
        password: data.password
      }
    }, 'name account', (err, user) => {
      if(!user.length) {
        console.log('cannot find user');
        socket.emit('resLogin', { message: 'failed' });
      } else {
        const resolveUser = {
          name: user[0].name,
          account: user[0].account,
          id: user[0].id,
          companies: user[0].companies,
          projects: user[0].projects,
          message: 'success'
        };
        socket.emit('resLogin', resolveUser);
      }
    });
  });
  socket.on('reqMakeCompany', (data) => {
    const company = new Companies({
      title: data.title,
      description: data.description,
      creator: {
        id: data.user,
        name: data.name
      },
      users: [{
        id: data.user,
        name: data.name
      }]
    });
    company.save((err, createdCompany) => {
      if (err) {
        console.log('company adding error');
        socket.emit('resMakeCompany', { message: 'failed' });
      } else {
        console.log(createdCompany.id);
        const resolveCompany = {
          _id: createdCompany.id,
          title: createdCompany.title,
          description: createdCompany.description,
          creator: createdCompany.creator,
          users: createdCompany.users,
          projects: createdCompany.projects,
          message: 'success'
        };
        console.log(resolveCompany);
        socket.emit('resMakeCompany', resolveCompany);
        Users.findById(data.user, (err, user) => {
          user.companies.push({
            id: createdCompany.id,
            title: createdCompany.title
          });
          user.save();
        });
      }
    });
  });
  socket.on('editCompany', (data) => {
    Users.update(
      { 'companies.id': data.id },
      { $set: { 'companies.$.title': data.title } },
      { multi: true },
      (err, users) => {
        console.log('company updated in users');
      }
    );
    Companies.findById(data.id, (err, company) => {
      company.title = data.title;
      company.description = data.description;
      company.save(() => {
        console.log('company have been edited');
        socket.emit('editCompany', {
          id: data.id,
          title: data.title,
          description: data.description,
          message: 'success'
        });
      });
    });
  });
  socket.on('deleteCompany', (data) => {
    Companies.findByIdAndRemove(data.id, () => {
      Users.update(
        {},
        { $pull: { companies: { id: data.id } } },
        { multi: true },
        () => {
          console.log('company deleted');
          socket.emit('deleteCompany', { id: data.id });
        }
      );
    });
  });
  socket.on('reqMakeProject', (data) => {
    const project = new Projects({
      title: data.title,
      description: data.description,
      creator: {
        id: data.user,
        name: data.name
      },
      users: [{
        id: data.user,
        name: data.name
      }],
      company: {
        id: data.companyId,
        title: data.companyTitle
      },
      tasks: []
    });
    project.save((err, createdProject) => {
      if (err) {
        console.log('project adding error');
        socket.emit('resMakeProject', { message: 'failed' });
      } else {
        const resolveProject = {
          id: createdProject.id,
          title: createdProject.title,
          description: createdProject.description,
          creator: createdProject.creator,
          users: createdProject.users,
          company: createdProject.company,
          tasks: [],
          message: 'success'
        };
        socket.emit('resMakeProject', resolveProject);
        Companies.findById(data.companyId, (err, company) => {
          company.projects.push({ id: createdProject.id, title: createdProject.title });
          company.save(() => {console.log('project is ok')});
        });
        Users.findById(data.user, (err, user) => {
          user.projects.push({ id: createdProject.id, title: createdProject.title });
          user.save(() => {console.log('project is ok2')});
        });
      }
    });
  });
  socket.on('editProject', (data) => {
    Companies.update(
      { 'projects.id': data.id },
      { $set: { 'projects.$.title': data.title } },
      { multi: true },
      () => {
        console.log('project updated in companies');
      }
    );
    Users.update(
      { 'projects.id': data.id },
      { $set: { 'projects.$.title': data.title } },
      { multi: true },
      () => {
        console.log('project updated in users');
      }
    );
    Projects.findById(data.id, (err, project) => {
      project.title = data.title;
      project.description = data.description;
      project.save((err, project) => {
        console.log('project updated in projects');
        socket.emit('editProject', {
          id: data.id,
          title: data.title,
          description: data.description,
          company: project.company.id,
          message: 'success'
        });
      });
    });
  });
  socket.on('deleteProject', (data) => {
    Projects.findByIdAndRemove(data.id, () => {
      Companies.update(
        {},
        { $pull: { projects: { id: data.id } } },
        { multi: true },
        () => {
          Users.update(
            {},
            { $pull: { projects: { id: data.id } } },
            { multi: true },
            () => {
              console.log('project deleted');
              socket.emit('deleteProject', { id: data.id });
            }
          );
        }
      );
    });
  });
  socket.on('reqMakeTask', (data) => {
    const task = new Tasks({
      title: data.title,
      description: data.description,
      sender: data.sender,
      project: data.project,
      performers: [data.sender]
    });
    task.save((err, createdTask) => {
      if (err) {
        console.log('task adding error');
        socket.emit('resMakeTask', { message: 'failed' });
      } else {
        const resolveTask = {
          id: createdTask.id,
          title: createdTask.title,
          description: createdTask.description,
          sender: createdTask.sender,
          project: createdTask.project,
          performers: createdTask.performers,
          active: createdTask.active,
          message: 'success'
        };
        socket.emit('resMakeTask', resolveTask);
        Projects.findById(data.project.id, (err, project) => {
          project.tasks.push({ id: createdTask.id, title: createdTask.title, active: createdTask.active });
          project.save(() => {console.log('task is ok')});
        });
      }
    });
  });
  socket.on('getCompanies', (data) => {
    Companies.find({ 'users.id': data.userId }, (err, companies) => {
      socket.emit('getCompanies', companies);
    });
  });
  socket.on('getPage', (data) => {
    switch(data.collection) {
      case 'companies':
        Companies.findById(data.id, (err, company) => {
          Projects.find({ 'company.id': data.id }, (err, projects) => {
            var result = {
              id: data.id,
              collection: data.collection,
              title: company.title,
              description: company.description,
              projects: projects,
              users: company.users,
              creator: company.creator
            };
            socket.emit('getPage', result);
          });
        });
        break;
      case 'projects':
        Projects.findById(data.id, (err, project) => {
          socket.emit('getPage', project);
        });
        break;
      case 'tasks':
        Tasks.findById(data.id, (err, task) => {
          socket.emit('getPage', task);
        });
        break;
      default:
        break;
    }
  });
  socket.on('toggleTask', (data) => {
    Tasks.findById(data.id, (err, task) => {
      task.active = !task.active;
      task.save(() => {console.log('task toggled')});
    });
    Projects.findOne({
      'tasks.id': data.id
    }, (err, project) => {
      for (let i = 0; i < project.tasks.length; i++) {
        if (project.tasks[i].id == data.id) {
          project.tasks[i].active = !project.tasks[i].active;
          project.save(() => {console.log('task saved')});
        }
      }
    });
  });
  socket.on('addUserToCompany', (data) => {
    Companies.findById(data.companyId, (err, company) => {
      company.users.push({ id: data.user.id, name: data.user.name });
      const companyTitle = company.title;
      company.save(() => {console.log('added to comp')});
      Users.findById(data.user.id, (err, user) => {
        user.companies.push({ id: data.companyId, title: companyTitle });
        user.save(() => {console.log('added to users')});
        socket.emit('addUserToCompany', {
          company: { id: data.companyId, title: companyTitle },
          user: data.user
        });
      });
    });
  });
  socket.on('addUserToProject', (data) => {
    Projects.findById(data.project.id, (err, project) => {
      project.users.push({ id: data.user.id, name: data.user.name });
      project.save(() => {console.log('added to projects')});
      Users.findById(data.user.id, (err, user) => {
        user.projects.push({ id: data.project.id, title: data.project.title });
        user.save(() => {console.log('added to users')});
        socket.emit('addUserToProject', {
          project: { id: data.project.id, title: data.project.title },
          company: data.company,
          user: data.user
        });
      });
    });
  });


  socket.on('getUserItems', (data) => {
    var result = [];
    Users.findById(data.id, (err, user) => {
      for (let i = 0; i < user.projects.length; i++) {
        Projects.findById(user.projects[i].id, (err, project) => {
          result.push(project);
          if (result.length == user.projects.length) {
            socket.emit('getUserItems', { result });
          }
        });
      }
    });
  });




  socket.on('getStats', (data) => {
    var response = {};
    response.page = data.page;
    response.doneTasks = 0;
    switch(data.page) {
      case 'general':
        Users.find({}, (err, users) => {
          response.users = users.length;
          Companies.find({}, (err, companies) => {
            response.companies = companies.length;
            Projects.find({}, (err, projects) => {
              response.projects = projects.length;
              Tasks.find({}, (err, tasks) => {
                response.tasks = tasks.length;
                socket.emit('getStats', response);
              });
            });
          });
        });
        break;
      case 'user':
        Users.findById(data.id, (err, user) => {
          response.companies = user.companies.length;
          Projects.find({ 'users.id': data.id }, (err, projects) => {
            response.projects = projects.length;
            Tasks.find({ 'performers.id': data.id }, (err, tasks) => {
              response.tasks = tasks.length;
              tasks.forEach(item => {
                if (!item.active) {
                  response.doneTasks++;
                }
              });
              socket.emit('getStats', response);
            });
          });
        });
        break;
      default:
        break;
    }
  });
  socket.on('getCompanyReport', (data) => {
    Companies.findById(data.id, (err, company) => {
      var projects = [];
      for (let i = 0; i < company.projects.length; i++) {
        Projects.findById(company.projects[i].id, (err, project) => {
          projects.push({
            id: project.id,
            tasks: project.tasks,
            title: project.title,
            users: project.users,
            company: project.company,
            creator: project.creator
          });
          if (projects.length == company.projects.length) {
            for (let i = 0; i < projects.length; i++) {
              var activeTasks = 0;
              var doneTasks = 0;
              projects[i].tasks.forEach(item => {
                if (item.active) {
                  activeTasks++;
                } else {
                  doneTasks++;
                }
              });
              projects[i].activeTasks = activeTasks;
              projects[i].doneTasks = doneTasks;
            }
            socket.emit('getCompanyReport', {
              id: data.id,
              companyTitle: company.title,
              projects: projects
            });
          }
        });
      }
    });
  });




  socket.on('getSearchData', (data) => {
    switch(data.collection) {
      case 'companies':
        Users.find({ 'companies.id': { $ne: data.id } }, (err, users) => {
          console.log(users);
          socket.emit('getSearchData', { users });
        });
        break;
      case 'projects':
        Users.find({
          'companies.id': data.company,
          'projects.id': { $ne: data.id }
        }, (err, users) => {
          getRecommendedUsersAndSend(socket, users);
        });
        break;
      case 'tasks':
        Users.find({
          'projects.id': data.company
        }, (err, users) => {
          console.log(users);
          var resUsers = [];
          for (let i = 0; i < users.length; i++) {
            Tasks.find({
              _id: data.id,
              'performers.id': { $ne: users[i].id }
            }, (err, task) => {
              if (task.length) {
                console.log(1);
                resUsers.push(users[i]);
              }
              if (i == users.length - 1) {
                console.log(resUsers);
                getRecommendedUsersAndSend(socket, resUsers);
                resUsers = [];
              }
            });
          }
        });
        break;
      default:
        break;
    }
  });
});

function getRecommendedUsersAndSend(socket, users) {
  var recUsers = [];
  var totalSum = 0;
  var average;
  var promise = new Promise((resolve, reject) => {
    for (let i = 0; i < users.length; i++) {
      Tasks.find({ 'performers.id': users[i].id }, (err, tasks) => {
        totalSum += tasks.length;
        console.log(1);
        if (i == users.length - 1) {
          average = totalSum / users.length;
          console.log(`average: ${average}`);
          resolve();
        }
      });
    }
  });
  promise.then(result => {
    console.log(`users length: ${users.length}`);
    for (let i = 0; i < users.length; i++) {
      console.log(`i is: ${i}`);
      Tasks.find({ 'performers.id': users[i].id }, (err, tasks) => {
        console.log(`tasks length: ${tasks.length}`);
        if (tasks.length <= average) {
          recUsers.push(users[i]);
          console.log(2);
          if (i == users.length - 1) {
            console.log(recUsers);
            socket.emit('getSearchData', { users, recUsers });
            recUsers = [];
            totalSum = 0;
            average = 0;
          }
        }
      });
    }
  });
  console.log(0);
}


