const app = require('express');
const router = app.Router();

const { storeTests, getTests } = require('../controller/tests-controller');


const { validateUser }  = require('../middleware/validator-middleware');

router.route('/')
  .post(storeTests)

router.route('/:userId')
  .get(getTests)
module.exports = router;