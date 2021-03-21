const exphbs = require('express-handlebars');
const rootPath = require('app-root-path');
const helpers = new require(rootPath + '/templates/views/helpers')();
const fs = require('fs');

var hbs = exphbs.create({
    helpers: helpers,
});

const wkhtmltopdf = require('wkhtmltopdf');

module.exports = async function (data, filename) {
    path = `./services/PDF-generator/templates/${filename}.hbs`;
    var html = await hbs.render(path, data);

    return new Promise((resolve, reject) => {
        wkhtmltopdf(html, (err, stream) => {
            if (err) {
                reject(err);
            }
            else {
                streamToString(stream)
                .then(buffer => {
                    resolve(buffer);
                })
                .catch(err => reject(err));
            }
        });
    });
};

function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.from(Buffer.concat(chunks), 'utf-8')));
    });
}