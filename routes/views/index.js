var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
const fetch = require('node-fetch');
const rootPath = require('app-root-path');
const captcha = require(rootPath + '/services/captcha/captcha');

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

		captcha(req.body.captcha, req.connection.remoteAddress)
		.then(res => {
			reqData();
		})
		.catch(err => {
			if(err.type === 'empty') {
				res.json({ "success": false, "msg": "Please, select captcha" });
			}
			else if(err.type === 'invalid') {
				res.json({ "success": false, "msg": "Failed captcha verification" });
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
