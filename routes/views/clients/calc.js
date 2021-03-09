var keystone = require('keystone');
var validator = require('validator');

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


            var response = {};
            response.client = validateVirtualClient(req.body.client);
            response.config = validateVirtualConfig(req.body.config);

            res.json(response);
        }

        if (req.query.type === "config") {

            res.json(calculateVirtual(req.body));
        }
    });

    view.on('post', { action: "physic" }, (next) => {

        if (req.query.type === "validation") {

            var response = {};

            for (const [key, item] of Object.entries(req.body.config)) {
                response[key] = validate(item.value, item.type);
            }

            res.json(response);
        }

        if (req.query.type === "config") {
            return res.json(calculatePhysic(req.body.config));
        }
    });

    view.render('clients/calc', { layout: 'info' });

    function validateVirtualClient(body) {

        invalidFields = {};
        for (const [key, item] of Object.entries(body)) {
            invalidFields[key] = validate(item.value, item.type);
        }

        return invalidFields;
    }

    function validateVirtualConfig(body) {

        //console.log(body);
        invalidFields = {};
        for (const [index, value] of Object.entries(body)) {
            var temp = {};
            for (const [key, item] of Object.entries(value)) {
                temp[key] = validate(item.value, item.type);
            }
            invalidFields[index] = temp;
        }

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
            partial: {},
            perMonth: 0,
        };

        //console.log(body);
        var serverCount = Number(body["serverCount"].value);

        var coreAmount = Number(body["core-input"].value);
        result.partial.coreRes = coreAmount * calculator.cores * serverCount;

        var ramAmount = Number(body["ram-input"].value);
        if (ramAmount <= 30) {
            ramAmount *= calculator.ram1 * serverCount;
        }
        else {
            ramAmount *= calculator.ram2 * serverCount;
        }
        result.partial.ramRes = ramAmount;

        var sataAmount = shd(Number(body["sata-input"].value));
        result.partial.sataRes = sataAmount * serverCount;
        var sasAmount = shd(Number(body["sas-input"].value));
        result.partial.sasRes = sasAmount * serverCount;
        var ssdAmount = shd(Number(body["ssd-input"].value));
        result.partial.ssdRes = ssdAmount * serverCount;

        result.perMonth = 0;
        for (const [key, value] of Object.entries(result.partial)) {
            result.perMonth += value;
        }

        return result;

        function shd(amount) {

            var result = 0;

            if (amount <= 20) {
                result = calculator.shd1;
            }
            else if (amount > 21 && amount <= 100) {
                result = calculator.shd2;
            }
            else if (amount <= 1024) {
                result = calculator.shd3;
            }
            else if (amount > 1024) {
                result = 0;
                return result;
            }

            return result * amount;
        }
    }

    function calculatePhysic(body) {

        let result = {
            partial: {},
            perMonth: 0
        };

        //console.log(body);

        var standCount = Number(body["standCount"].value);
        var standPercent = Number(body["standPercent"].value);
        standCount *= standPercent * 0.01;
        result.partial.standRes = calculator.stand * standCount;

        var standEnergy = Number(body["standEnergy"].value);
        if (standEnergy <= 3) {
            standEnergy *= calculator.standCharge1 * standCount;
        }
        else if (standEnergy > 3 && standEnergy <= 5) {
            standEnergy *= calculator.standCharge2 * standCount;
        }
        else if (standEnergy > 5 && standEnergy <= 7) {
            standEnergy *= calculator.standCharge3 * standCount;
        }
        result.partial.standEnergyRes = standEnergy;

        var unitCount = Number(body["unit"].value);
        result.partial.unitRes = unitCount * calculator.unit;

        var unitEnergy = Number(body["unitEnergy"].value);
        if (unitEnergy <= 0.75) {
            unitEnergy *= calculator.unitCharge1 * unitCount;
        }
        else if (unitEnergy > 0.75 && unitEnergy <= 1.4) {
            unitEnergy *= calculator.unitCharge2 * unitCount;
        }
        else if (unitEnergy > 1.4 && unitEnergy <= 2.5) {
            unitEnergy *= calculator.unitCharge3 * unitCount;
        }
        result.partial.unitEnergyRes = unitEnergy;

        var internetChannel = Number(body["internetChannel"].value);
        if (internetChannel <= 0.1) {
            internetChannel = 0;
        }
        else if (internetChannel > 0.1 || internetChannel <= 10.0) {
            internetChannel *= calculator.internet2 * unitCount;
        }
        else if (internetChannel > 10.0) {
            internetChannel *= calculator.internet3 * unitCount;
        }
        result.partial.internetChannelRes = internetChannel;

        //console.log(result.partial);
        for (const [key, value] of Object.entries(result.partial)) {
            result.perMonth += value;
        }

        result.perMonth = Math.floor(result.perMonth);

        return result;
    }
}
