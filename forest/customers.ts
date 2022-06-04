import { Address } from "../models/addresses";
import { Customer } from "../models/customers";

const Liana = require('forest-express-sequelize');

Liana.collection('customers', {
  actions: [{
    name: 'Generate invoice',
    download: true,
    endpoint: '/forest/customers/actions/generate-invoice'
  }, {
    name: 'Charge credit card',
    type: 'single',
    endpoint: '/forest/customers/actions/charge-credit-card',
    fields: [{
      field: 'amount',
      isRequired: true,
      description: 'The amount (USD) to charge the credit card. Example: 42.50',
      type: 'Number'
    }, {
      field: 'description',
      isRequired: true,
      description: 'Explain the reason why you want to charge manually the customer here',
      type: 'String'
    }]
  }],
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer: Customer): string => {
      return customer.firstname + ' ' + customer.lastname;
    },
    set: (customer: Customer, fullname: string): Customer => {
      let names = fullname.split(' ');
      customer.firstname = names[0];
      customer.lastname = names[1];

      // Don't forget to return the customer.
      return customer;
    },
  }, {
    field: 'full_address',
    type: 'String',
    get: (customer: Customer) => {
      return Address
        .findOne({ where: { customer_id: customer.id } })
        .then((address) => {
          return address.address_line_1 + '\n' +
            address.address_line_2 + '\n' +
            address.address_line_city + address.country;
        });
    }
  }, {
    field: 'age',
    type: 'Number',
    get: (customer: Customer): number => {
      let diff = Date.now() - new Date(customer.birthDay).getTime();
      return Math.floor(diff / 31557600000); // Divide by 1000*60*60*24*365.25
    }
  }]
});