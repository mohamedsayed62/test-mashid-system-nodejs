const app = require('express');
const router = app.Router();

const {showReports, downloadExcel}  = require('../controller/reports-controller');
const verifyToken = require('../middleware/verify-token-middleware');

const { validateUser }  = require('../middleware/validator-middleware');

router.route('/')
  .post(showReports);

router.route('/download')
  .post(downloadExcel)

router.route('/admin')
  .post(verifyToken, showAdminReports);

module.exports = router;
