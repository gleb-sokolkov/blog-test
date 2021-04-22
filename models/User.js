const keystone = require('keystone');
const Types = keystone.Field.Types;

const User = new keystone.List('User', {
    hidden: true,
});

User.add({
    name: { type: String, required: true, initial: false, },
    password: { type: Types.Password, required: true, initial: false, },
    email: { type: Types.Email, required: true, initial: false, },
    createdAt: {type: Types.Date, default: Date.now(), },
});

User.register();