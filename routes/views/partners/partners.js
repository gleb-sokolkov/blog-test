var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'partners';

	locals.data = {
		service : {},
	};

	view.on('init', function(next){
		var q = keystone.list("Service").model.findOne({name: 'partners'});
		q.exec(function(err, res){
			locals.data.service = res;
			next(err);
		});
	});


	// Render the view
	view.render('partners/partners', { layout: 'info' });

};
