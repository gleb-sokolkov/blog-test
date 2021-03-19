var keystone = require('keystone');
var validator = require('validator');
var rootPath = require('app-root-path');
var genPDF = require(rootPath + '/services/PDF-generator/genPDF');
var sendEmail = require(rootPath + '/services/MailSend/email');
var captcha = require(rootPath + '/services/captcha/captcha');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var calculator = null;

    locals.section = 'calc';
    locals.data = {
        calculator: {},
    };

    view.on('init', function (next) {
        keystone.list("Calculator").model
            .findOne({ name: "Calculator1" })
            .exec(function (error, res) {
                //because mongoose query response not iterable like objects, all fields puts as we can 
                calculator = res;
                locals.data.calculator.virtualName = calculator.virtualName;
                locals.data.calculator.physicalName = calculator.physicalName;
                locals.data.calculator.coresMin = calculator.coresMin;
                locals.data.calculator.coresMax = calculator.coresMax;
                locals.data.calculator.ramMin = calculator.ramMin;
                locals.data.calculator.ramMax = calculator.ramMax;
                locals.data.calculator.sataMin = calculator.sataMin;
                locals.data.calculator.sataMax = calculator.sataMax;
                locals.data.calculator.sasMin = calculator.sasMin;
                locals.data.calculator.sasMax = calculator.sasMax;
                locals.data.calculator.ssdMin = calculator.ssdMin;
                locals.data.calculator.ssdMax = calculator.ssdMax;
                locals.data.calculator.step = 2;
                next(error);
            });
    });

    view.on('post', { action: "virtual" }, (next) => {

        if (req.query.type === "validation") {
            var response = validateVirtual(req.body);
            res.json(response);
        }

        if (req.query.type === "config") {

            res.json(calculateVirtual(req.body.config));
        }

        if (req.query.type === "gen-kp") {

            captcha(req.body.captcha, req.connection.remoteAddress)
                .then(resp => {
                    genPDF(req.body, 'v_kp')
                        .then(response => {
                            lastFile = response;
                            sendEmail(response, 'virtual_kp.pdf'); 
                            res.contentType("application/pdf");
                            res.send(response);
                        })
                        .catch(error => {
                            res.status(500);
                            res.json({ text: "Ошибка генерации PDF-файла!" });
                        });
                })
                .catch(err => res.json(err));
        }

        if (req.query.type === "gen-vr") {
            captcha(req.body.captcha, req.connection.remoteAddress)
                .then(resp => {
                    genPDF(req.body, 'v_vr')
                        .then(response => {
                            lastFile = response;
                            sendEmail(response, 'virtual_vr.pdf');
                            res.contentType('application/pdf');
                            res.send(response);
                        })
                        .catch(err => {
                            res.status(500);
                            res.send({ text: "Ошибка генерации PDF-файла!" });
                        });
                })
                .catch(err => res.json(err));
        }
    });

    view.on('post', { action: "physic" }, (next) => {

        if (req.query.type === "validation") {

            var response = {
                config: {},
                isValid: true,
            };

            for (const [key, item] of Object.entries(req.body.config)) {
                var valid = validate(item.value, item.type);
                response.config[key] = valid;
                response.isValid *= !valid;
            }

            res.json(response);
        }

        if (req.query.type === "config") {
            return res.json(calculatePhysic(req.body.config));
        }

        if (req.query.type === "gen-kp") {

            captcha(req.body.captcha, req.connection.remoteAddress)
                .then(resp => {
                    genPDF(req.body, 'f_kp')
                        .then(response => {
                            lastFile = response;
                            sendEmail(response, 'physic_kp.pdf');
                            res.contentType("application/pdf");
                            res.send(response);
                        })
                        .catch(error => {
                            res.status(500);
                            res.send({ text: "Ошибка генерации PDF-файла!" });
                        });
                })
                .catch(err => res.json(err));
        }

        if (req.query.type === "gen-vr") {

            captcha(req.body.captcha, req.connection.remoteAddress)
                .then(resp => {
                    genPDF(req.body, 'f_vr').then(response => {
                        lastFile = response;
                        sendEmail(response, 'physic_vr.pdf');
                        res.contentType('application/pdf');
                        res.send(response);
                    }).catch(err => {
                        res.status(500);
                        res.send({ text: "Ошибка генерации PDF-файла!" });
                    });
                })
                .catch(err => res.json(err));
        }
    });

    view.render('clients/calc', { layout: 'info' });

    function validateVirtual(body) {

        invalidFields = {
            client: {},
            config: {},
            isValid: true,
        };
        for (const [key, item] of Object.entries(body.client)) {
            var valid = validate(item.value, item.type);
            invalidFields.client[key] = valid;
            invalidFields.isValid *= !valid;
        }

        for (const [index, value] of Object.entries(body.config)) {
            var temp = {};
            for (const [key, item] of Object.entries(value.config)) {
                var valid = validate(item.value, item.type);
                temp[key] = valid;
                invalidFields.isValid *= !valid;
            }
            invalidFields.config[index] = temp;
        }

        invalidFields.isValid = Boolean(invalidFields.isValid);

        return invalidFields;
    }

    function validate(str, type) {

        var result = false;

        switch (type) {

            case "number":
                result = !validator.isNumeric(str);
                break;
            case "range":
                result = !validator.isNumeric(str);
                break;
            case "tel":
                result = !validator.isMobilePhone(str, ['ru-RU']);
                break;
            case "email":
                result = !validator.isEmail(str);
                break;
            default:
                result = validator.isEmpty(str);
                break;
        }

        return result;
    }

    function calculateVirtual(body) {

        var result = {
            config: {},
            perMonth: 0,
        };

        //console.log(body);
        var serverCount = Number(body["serverCount"].value) || 1;

        var coreAmount = Number(body["core-input"].value);
        result.config.coreRes = coreAmount * calculator.cores * serverCount;

        var ramAmount = Number(body["ram-input"].value);
        if (ramAmount <= 30) {
            ramAmount *= calculator.ram1 * serverCount;
        }
        else {
            ramAmount *= calculator.ram2 * serverCount;
        }
        result.config.ramRes = ramAmount;

        var sataAmount = shd(Number(body["sata-input"].value), serverCount);
        result.config.sataRes = sataAmount;
        var sasAmount = shd(Number(body["sas-input"].value), serverCount);
        result.config.sasRes = sasAmount;
        var ssdAmount = shd(Number(body["ssd-input"].value), serverCount);
        result.config.ssdRes = ssdAmount;

        result.perMonth = 0;
        for (const [key, value] of Object.entries(result.config)) {
            if (value !== "Договорная") {
                result.perMonth += value;
            }
        }

        return result;

        function shd(amount, mult) {

            var result = 0;

            if (amount <= 20) {
                result = calculator.shd1;
            }
            else if (amount > 21 && amount <= 100) {
                result = calculator.shd2;
            }
            else if (amount > 100 && amount <= 1024) {
                result = calculator.shd3;
            }
            else if (amount > 1024) {
                result = 'Договорная';
                return result;
            }

            return result * amount * mult;
        }
    }

    function calculatePhysic(body) {

        let result = {
            config: {},
            perMonth: 0
        };

        //console.log(body);

        var standCount = Number(body["standCount"].value);
        var standPercent = Number(body["standPercent"].value);
        standCount *= standPercent * 0.01;
        result.config.standRes = calculator.stand * standCount;

        var standEnergy = Number(body["standEnergy"].value);
        if (standEnergy < 0.001) {
            standEnergy = 0;
        }
        else if (standEnergy <= 3) {
            standEnergy = calculator.standCharge1 * standCount;
        }
        else if (standEnergy > 3 && standEnergy <= 5) {
            standEnergy = calculator.standCharge2 * standCount;
        }
        else if (standEnergy > 5 && standEnergy <= 7) {
            standEnergy = calculator.standCharge3 * standCount;
        }
        result.config.standEnergyRes = standEnergy;

        var unitCount = Number(body["unit"].value);
        result.config.unitRes = unitCount * calculator.unit;

        var unitEnergy = Number(body["unitEnergy"].value);
        if (unitEnergy < 0.001) {
            unitEnergy = 0;
        }
        else if (unitEnergy <= 0.75) {
            unitEnergy = calculator.unitCharge1 * unitCount;
        }
        else if (unitEnergy > 0.75 && unitEnergy <= 1.4) {
            unitEnergy = calculator.unitCharge2 * unitCount;
        }
        else if (unitEnergy > 1.4 && unitEnergy <= 2.5) {
            unitEnergy = calculator.unitCharge3 * unitCount;
        }
        result.config.unitEnergyRes = unitEnergy;

        var internetChannel = Number(body["internetChannel"].value);
        if (internetChannel <= 0.1) {
            internetChannel = calculator.internet1 * unitCount;
        }
        else if (internetChannel > 0.1 && internetChannel < 10.0) {
            internetChannel = calculator.internet2 * unitCount;
        }
        else if (internetChannel >= 10.0) {
            internetChannel = calculator.internet3 * unitCount;
        }
        result.config.internetChannelRes = internetChannel;

        //console.log(result.config);
        for (const [key, value] of Object.entries(result.config)) {
            result.perMonth += value;
        }

        result.perMonth = Math.floor(result.perMonth);

        return result;
    }
}
