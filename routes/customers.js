const express = require('express');
const router = express.Router();
const Liana  = require('forest-express-sequelize');

const permissionMiddlewareCreator = new Liana.PermissionMiddlewareCreator('customers');

router.post('/actions/generate-invoice', Liana.ensureAuthenticated, (req, res) => {
  let options = {
    root: __dirname + '/../public/',
    dotfiles: 'deny',
    headers: {
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Content-Disposition': 'attachment; filename="invoice-2342.pdf"'
    }
  };

  let fileName = 'invoice-2342.pdf';
  res.sendFile(fileName, options, (error) => {
    if (error) { next(error); }
  });
});

router.post('/actions/charge-credit-card', Liana.ensureAuthenticated, (req, res) => {
  res.send({
    html: `<p>Hello world: charge-credit-card</p>`
  });
});

// Get a list of Accounts
router.get('/customers', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Accounts
router.get('/customers/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

module.exports = router;