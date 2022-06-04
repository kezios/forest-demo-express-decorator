const path = require('path');

const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const requireAll = require('require-all');

const { errorHandler, ensureAuthenticated, PUBLIC_ROUTES } = require('forest-express-sequelize');

const app = express();

let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];

if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(','));
}

const corsConfig = {
  origin: allowedOrigins,
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
};

app.use(
  '/forest/authentication',
  cors({
    ...corsConfig,
    // The null origin is sent by browsers for redirected AJAX calls
    // we need to support this in authentication routes because OIDC
    // redirects to the callback route
    origin: corsConfig.origin.concat('null'),
  }),
);
app.use(cors(corsConfig));
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '3mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//// LOG ////
morgan.token('user', (req) => (req.user ? req.user.email : 'no user info'));
morgan.token('team', (req) => (req.user ? req.user.team : '-'));
morgan.token('req-url', (req) => `${req.path}`);
morgan.token('req-query', (req) => (req.query ? JSON.stringify(req.query) : '-'));
morgan.token('req-body', (req) => (req.body ? JSON.stringify(req.body) : '-'));

app.use(morgan(':user :team [:date[clf]] :method :req-url :req-query :req-body ==> :status'));

app.use(
  jwt({
    secret: process.env.FOREST_AUTH_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256'],
  }),
);

app.use('/forest', (request, response, next) => {
  if (PUBLIC_ROUTES.includes(request.url)) {
    return next();
  }

  return ensureAuthenticated(request, response, next);
});

requireAll({
  dirname: path.join(__dirname, 'routes'),
  recursive: true,
  resolve: (Module) => app.use('/forest', Module),
});

requireAll({
  dirname: path.join(__dirname, 'middlewares'),
  recursive: true,
  resolve: (Module) => Module(app),
});

app.use(errorHandler());

module.exports = app;
