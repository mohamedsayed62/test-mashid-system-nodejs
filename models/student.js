const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true
  },
  parent_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema);