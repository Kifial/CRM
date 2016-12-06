const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tasksSchema = new Schema({
  title: String,
  description: String,
  project: {
    id: ObjectId,
    title: String
  },
  active: {
    type: Boolean,
    default: true
  },
  sender: {
    id: ObjectId,
    name: String
  },
  performers: [{
    id: ObjectId,
    name: String
  }],
  subtasks: [{
    id: String,
    title: String,
    active: {
      type: Boolean,
      default: true
    }
  }]
});

const Tasks = mongoose.model('tasks', tasksSchema);

module.exports = Tasks;
