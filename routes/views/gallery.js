const keystone = require('keystone');
const Gallery = keystone.list('Gallery');
const GalleryImage = keystone.list('GalleryImage');
const cloudinary = require('cloudinary');
const cloudinarySecure = keystone.get('cloudinary secure') || false;
const firstPage = 1;
const pageSize = 4;

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'gallery';
	locals.filters = {
		galleries: [],
	};
	locals.data = {
		galleries: [],
		images: [],
	};

	// // Load the galleries by sortOrder
	// view.query('galleries', keystone.list('Gallery').model.find().sort('sortOrder'));

	view.on('init', async (next) => {
		const result = await Gallery.model
			.find()
			.populate('author')
			.sort('-publishedDate')
			.exec()
			.catch(err => next(err));
		locals.data.galleries = result;
		next();
	});

	view.on('init', async (next) => {
		if (!locals.data.galleries.length) {
			next();
		}
		if (!req.params.gallery) { // if request without any sort of parameters, then it means we just response first gallery in sorted array
			locals.filters.galleries = [locals.data.galleries[0]];
		}
		else if (req.params.gallery === 'all') {
			locals.filters.galleries = await Gallery.model.find().populate('author');
		}
		else {
			locals.filters.galleries = await Gallery.model.find({ key: req.params.gallery }).populate('author');

			if (locals.filters.galleries.length <= 0) {
				res.redirect('/gallery');
			}
		}
		next();
	});

	//set initial page for ajax requests from client side
	view.on('init', (next) => {
		locals.data.initialPage = parseInt(req.query.page) || firstPage;
		locals.data.pageSize = parseInt(req.query.size) || pageSize;
		next();
	});

	//load imagePage by gallery filter
	view.on('get', { action: 'fetch' }, async (next) => {
		const q = GalleryImage.paginate({
			page: parseInt(req.query.page) || firstPage,
			perPage: parseInt(req.query.size) || pageSize,
		})
			.populate('gallery');
		if (locals.filters.galleries.length > 0) {
			q.where('gallery').in(locals.filters.galleries);
		}
		q.exec((err, result) => {
			req.result = result;
			next(err);
		});
	});

	view.on('get', { action: 'fetch' }, (next) => {
		const result = req.result;
		const response = {
			current: result.currentPage,
			size: parseInt(req.query.size),
			first: result.first,
			last: result.last,
			previous: result.previous,
			next: result.next,
			images: result.results.map(item => {
				return {
					title: item.title,
					body: (() => {
						const public_id = item.body.public_id || '';
						const format = item.body.format || '';
						const imageURL = public_id.concat('.', format);
						return cloudinary.url(imageURL, { secure: cloudinarySecure });
					})(),
				}
			}),
		};
		res.status(200).json(response);
	});

	// Render the view
	view.render('gallery', { layout: 'info' });
};

