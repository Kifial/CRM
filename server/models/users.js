const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const usersSchema = new Schema({
  name: String,
  account: {
    login: String,
    password: String
  },
  email: String,
  tel: String,
  aboutMe: String,
  companies: [{
    id: ObjectId,
    title: String
  }],
  projects: [{
    id: ObjectId,
    title: String
  }]
});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;