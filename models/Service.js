var keystone = require('keystone');
var Types = keystone.Field.Types;

var Service = new keystone.List('Service', {
    map: { name: "name" },
    autokey: { from: "name", path: "key", unique: true },
});

Service.add({
    name: {type: Types.Text, required: true },
    title: { type: Types.Text },
    content: { type: Types.Html, wysiwyg: true, height: 400, },
});

Service.defaultColumns = "name title";
Service.register();