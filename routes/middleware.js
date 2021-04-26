/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
const rootPath = require('app-root-path');
const { verifyToken, getTokenFromHeader } = require(rootPath + '/services/jwt');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
		{ label: 'About', key: 'about', href: '/about'},
		{ label: 'Cloud Services', key: 'cservices', href: '/cservices'},
		{ label: 'Carier', key: 'carier', href: '/carier'}
	];
	res.locals.user = req.user;

	res.locals.prod = process.env.APP_STATE === "prod";

	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.auth = (req, res, next) => {
	//const token = getTokenFromHeader(req);
	const token = req.body.accessToken;
	if(!token) {
		return res.status(401).json({
			msg: "Вы не авторизированы",
		});
	}
	verifyToken(token)
	.then(payload => {
		req.user = payload;
		next();
	})
	.catch(err => res.status(401).json({
		msg: "Серверу не удалось авторизировать вас",
	}));
	
};
