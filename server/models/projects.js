const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const projectsSchema = new Schema({
  title: String,
  creator: {
    id: ObjectId,
    name: String
  },
  description: String,
  company: {
    id: ObjectId,
    title: String
  },
  tasks: [{
    id: ObjectId,
    title: String,
    active: Boolean
  }],
  users: [{
    id: ObjectId,
    name: String
  }]
});

const Projects = mongoose.model('projects', projectsSchema);

module.exports = Projects;
