var keystone = require('keystone');
var mailgun = require('mailgun-js')({ 
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN 
});

module.exports = function (attachment, filename) {

    return new Promise((resolve, reject) => {
        keystone.list('Y').model.find().where('isAdmin', true).exec(function (err, admins) {
            if (err) reject(err);

            var attch = new mailgun.Attachment({
                data: attachment, 
                filename: filename,
                contentType: 'application/pdf',
            });

            var data = {
                from: 'calculator@coredatanet.ru',
                to: admins.map(item => item.email),
                subject: 'Hello',
                text: 'Сгенерированный документ',
                attachment: attch,
            };

            mailgun.messages().send(data, (error, body) => {
                if(error) {
                    reject(error);
                }
                if(body) {
                    resolve(body);
                }
            });
        });
    });
}