const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  student_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  degree: {
    type: Number,
    requred: true
  }
});

module.exports = mongoose.model('Test', testSchema);