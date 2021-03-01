var keystone = require('keystone');
var validator = require('validator');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'calc';

    view.on('post', { action: "virtual" }, (next) => {

        if (req.query.type === "validation") {

            var invalidFields = {};

            invalidFields.name = validator.isEmpty(req.body.name);
            invalidFields.address = validator.isEmpty(req.body.address);
            invalidFields.addressFact = validator.isEmpty(req.body.addressFact);
            invalidFields.numberPhone = !validator.isMobilePhone(req.body.numberPhone, ['ru-RU']);
            invalidFields.email = !validator.isEmail(req.body.email);
            invalidFields.rsch = validator.isEmpty(req.body.rsch);
            invalidFields.ks = validator.isEmpty(req.body.ks);
            invalidFields.BIK = validator.isEmpty(req.body.BIK);
            invalidFields.INN = !validator.isNumeric(req.body.INN);
            invalidFields.OGRN = validator.isEmpty(req.body.OGRN);

            res.json(invalidFields);
        }

        if(req.query.type === "config") {
            console.log(req.body);
            res.json({kek : "kek"});
        }
    });
    view.render('clients/calc', { layout: 'info' });
}