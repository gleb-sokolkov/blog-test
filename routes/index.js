/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/about', middleware.auth, routes.views.about);
	app.get('/clients/cservices', routes.views.clients.cservices);
	app.get('/clients/rent', routes.views.clients.rent);
	app.get('/clients/placement', routes.views.clients.placement);
	app.get('/partners/partners', routes.views.partners.partners);
	app.get('/carier', routes.views.carier);
	app.get('/contact', routes.views.contact);
	app.get('/services/service', routes.views.service);
	
	app.all('/signup', routes.views.signup);
	app.all('/signin', routes.views.signin);

	app.all('/clients/calc', routes.views.clients.calc);
	app.all('/', routes.views.index);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
