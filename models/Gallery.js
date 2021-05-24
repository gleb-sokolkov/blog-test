var keystone = require('keystone');
var Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
	drilldown: 'author',
});

Gallery.add({
	name: { type: String, required: true },
	subtext: { type: String },
	publishedDate: { type: Date, default: Date.now },
	author: { type: Types.Relationship, ref: 'Y', index: true, },
});

Gallery.relationship({ ref: 'GalleryImage', path: 'gallery-images', refPath: 'gallery', });
Gallery.register();
