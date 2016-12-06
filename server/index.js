const express = require('express');
const mongoose = require('mongoose');
const port = 8080;
const Users =  require('./models/users');
const Projects = require('./models/projects');
const Companies = require('./models/companies');
const Tasks = require('./models/tasks');

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


app.get('/', (req, res) => {
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
      }
    })
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
      }
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
          message: 'success'
        };
        socket.emit('resMakeProject', resolveProject);
        Companies.findById(data.companyId, (err, company) => {
          company.projects.push({ id: createdProject.id, title: createdProject.title });
          company.save(() => {console.log('project is ok')});
        });
      }
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
          project.tasks.push({ id: createdTask.id, title: createdTask.title });
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
          socket.emit('getPage', company);
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




  socket.on('getStats', (data) => {
    var response = {};
    switch(data.page) {
      case 'general':
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
        break;
      default:
        break;
    }
  });
});


