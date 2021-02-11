var keystone = require('keystone');
var Types = keystone.Field.Types;

var ServiceCard = new keystone.List('ServiceCard', {
    map : { name: "title" },
    autokey: { from: 'title', path: 'key', unique: true },
});

ServiceCard.add({
    title: { type: Types.Text, required: true },
    content: { type: Types.Html, wysiwyg: true, height: 400, },
});

ServiceCard.defaultColumns = "title";
ServiceCard.register();