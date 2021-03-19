const exphbs = require('express-handlebars');
const rootPath = require('app-root-path');
const helpers = new require(rootPath + '/templates/views/helpers')();
const fs = require('fs');
const html_to_pdf = require('html-pdf-node');

var hbs = exphbs.create({
    helpers: helpers,
});

module.exports = async function v_genKP(data, path) {

    path = `./services/PDF-generator/templates/${path}.hbs`;
    var html = await hbs.render(path, data);

    let options = { 
        format: "A4",
        margin: {
            top: 30,
            bottom: 30,
            right: 30,
            left: 30,
        }
    };
    let file = { content: html };

    const result = await html_to_pdf.generatePdf(file, options);

    return result;
}

