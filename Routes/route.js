const app = require('express');
const router = app.Router();

const { storeUser, getUser, deleteUser } = require('../controller/login-controller');


const { validateUser }  = require('../middleware/validator-middleware');

router.route('/')
  .post(validateUser, storeUser);

router.route('/:id')
  .get(getUser)
  .delete(deleteUser)


module.exports = router;