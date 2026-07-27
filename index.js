const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

const cors = require('cors');
const router = require('./Routes/route');
const studentRouter = require('./Routes/studentRoute');
const attendanceRouter = require('./Routes/attendance-route');
const testsRouter = require('./Routes/tests-route');
const reportsRouter = require('./Routes/reports-route');

app.use(cors());
const dns = require("node:dns");
dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
      console.log('Connected to MongoDB');
  })
  .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
  });


app.use(express.json());



app.use('/api/users', router);
app.use('/api/students', studentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/tests', testsRouter);
app.use('/api/reports', reportsRouter);

app.use((err, req, res, next) => {
  res.status(err.code || 500).json({ status: err.status || 'error', message: err.message, code: err.code || 500 });
})



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});