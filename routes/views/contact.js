var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';

	locals.data = {
		service : {},
	};

	view.on('init', function(next){
		var q = keystone.list("Service").model.findOne({name: 'contact'});
		q.exec(function(err, res){
			locals.data.service = res;
			next(err);
		});
	});


	view.render('contact', { layout: 'contact'});
};
