import * as express from 'express';
import { PermissionMiddlewareCreator, RecordsGetter } from "forest-express-sequelize";

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('customers');

router.post('/customers/actions/generate-invoice', permissionMiddlewareCreator.list(), (req, res, next) => {
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
    console.log('error', error)
    if (error) { next(error); }
  });
});

router.post('/customers/actions/charge-credit-card', permissionMiddlewareCreator.list(), (req, res) => {
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