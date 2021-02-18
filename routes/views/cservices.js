var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'cservices';

	locals.data = {
		services : [],
	};

	view.on('init', function(next){
		var q = keystone.list("Service").model.find();
		q.exec(function(err, res){
			locals.data.services = res;
			next(err);
		});
	});


	// Render the view
	view.render('cservices', { layout: 'info' });

};
