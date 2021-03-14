// const mailgun = require('mailgun-js')({
//     apiKey: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN,
// });

const exphbs = require('express-handlebars');
const rootPath = require('app-root-path');
const helpers = new require(rootPath + '/templates/views/helpers')();
var hbs = exphbs.create({
    helpers: helpers,
});

module.exports = async function (template, data, attachment) {

    path = `./services/MailSend/templates/${template}.hbs`;
    var html = await hbs.render(path, data);

    var data = {
        from: 'info@coredatanet.ru',
        to: 'zmihpog@gmail.com',
        subject: 'Здравствуйте',
        text: 'html text here',
        attachment: attachment,
    };

    // mailgun.messages().send(data, function (error, body) {
    //     console.log(body);
    // });
}