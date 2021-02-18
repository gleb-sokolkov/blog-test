var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
const fetch = require('node-fetch');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'home' }, function (next) {

		if (req.body.captcha === undefined ||
			req.body.captcha === null ||
			req.body.captcha === '') {
			return res.json({ "success": false, "msg": "Please, select captcha" });
		}

		const secret = (process.env.APP_STATE === "dev") ? process.env.TRECAPTCHA_SECRET_KEY : process.env.RECAPTCHA_SECRET_KEY;
		const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

		fetch(verifyURL)
			.then(res => res.json())
			.then(body => {
				if (body.success !== undefined && !body.success) {
					res.json({ "success": false, "msg": "Failed captcha verification" });
				}
				else {
					reqData();
				}
			});

		function reqData() {
			var newEnquiry = new Enquiry.model();
			var updater = newEnquiry.getUpdateHandler(req);

			updater.process(req.body, {
				flashErrors: true,
				fields: 'name, email, company, message',
				errorMessage: 'There was a problem submitting your enquiry:',
			}, function (err) {
				if (err) {
					//locals.validationErrors = err.errors;
					res.json({ "success": false, "msg": "Wrong enquiry" });
				} else {
					locals.enquirySubmitted = true;
					res.json({ "success": true, "msg": "Success enquiry" });
				}
				//next();
			});
		}
	});

	locals.data = {
		services : []
	};

	view.on('init', function (next) {
		var query = keystone.list('ServiceCard').model.find();
		query.exec(function (err, results) {
			locals.data.services = results;
			next(err);
		});
	});

	// Render the view
	view.render('index');
};
