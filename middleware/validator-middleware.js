const { body } = require('express-validator');

const validateUser = [
  body('name')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('الاسم لا يقل عن 2 حروف'),
];

module.exports = {
  validateUser,
};