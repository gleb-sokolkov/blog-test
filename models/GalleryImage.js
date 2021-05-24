var keystone = require('keystone');
var Types = keystone.Field.Types;

var GalleryImage = new keystone.List('GalleryImage', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

GalleryImage.add({
	title: { type: String, required: true },
	body: { type: Types.CloudinaryImage, autoCleanup: true, },
    gallery: { type: Types.Relationship, ref: 'Gallery', many: true, },
});

GalleryImage.register();
