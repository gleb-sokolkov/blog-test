const keystone = require('keystone');
const Types = keystone.Field.Types;

const Token = new keystone.List('Token', {
    hidden: true,
});

Token.add({
    uuid: { type: String },
    userID: { type: String }, 
});

Token.register();