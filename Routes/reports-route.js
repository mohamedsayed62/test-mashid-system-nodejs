const app = require('express');
const router = app.Router();

const {showReports, downloadExcel}  = require('../controller/reports-controller');


const { validateUser }  = require('../middleware/validator-middleware');

router.route('/')
  .post(showReports);

router.route('/download')
  .post(downloadExcel)

module.exports = router;