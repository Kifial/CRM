const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const companiesSchema = new Schema({
  title: String,
  description: String,
  creator: {
    id: ObjectId,
    name: String
  },
  projects: [{
    id: ObjectId,
    title: String,
    description: String
  }],
  users: [{
    id: ObjectId,
    name: String
  }]
});

const Companies = mongoose.model('companies', companiesSchema);

module.exports = Companies;
