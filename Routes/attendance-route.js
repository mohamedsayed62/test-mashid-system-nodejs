const app = require('express');
const router = app.Router();
const { storeAttendance, getAttendance} = require('../controller/attendace-controller');

router.route('/')
  .post(storeAttendance);

router.route('/get-attendance')
  .post(getAttendance);



module.exports = router;