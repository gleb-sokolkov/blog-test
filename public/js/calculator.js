//var debounce = require('debounce');

var virtualForm = document.getElementById("virtual-form");

if (virtualForm) {
    virtualForm.addEventListener('submit', (e) => onForm(e));
}

function onForm(e) {
    e.preventDefault();

    var calcProgress = document.getElementById('calc-progress');
    calcProgress.style.opacity = '1';

    var validation = new Promise(sendClientInfoToValidation);
    validation.then(res => {
        calcProgress.style.opacity = '0';
    });
    validation.catch(err => {
        calcProgress.style.opacity = '0';
    });
}

function sendClientInfoToValidation(resolve, reject) {

    var action = document.querySelector('[name="action"]');
    var name = document.querySelector('[name="name"]');
    var address = document.querySelector('[name="address"]');
    var addressFact = document.querySelector('[name="addressFact"]');
    var numberPhone = document.querySelector('[name="numberPhone"]');
    var email = document.querySelector('[name="email"]');
    var rsch = document.querySelector('[name="rsch"]');
    var ks = document.querySelector('[name="ks"]');
    var BIK = document.querySelector('[name="BIK"]');
    var INN = document.querySelector('[name="INN"]');
    var OGRN = document.querySelector('[name="OGRN"]');

    fetch('/clients/calc?type=validation', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            action: action.value,
            name: name.value,
            address: address.value,
            addressFact: addressFact.value,
            numberPhone: numberPhone.value,
            email: email.value,
            rsch: rsch.value,
            ks: ks.value,
            BIK: BIK.value,
            INN: INN.value,
            OGRN: OGRN.value,
        }),
    })
        .then(res => res.json())
        .then(res => {

            var errorElement;

            for (const [key, value] of Object.entries(res)) {
                //console.log(`${key} ${value}`);
                var field = document.querySelector(`[name="${key}"]`);
                field.classList.remove("is-valid", "is-invalid");
                field.classList.add(value ? "is-invalid" : "is-valid");

                if (value) {
                    errorElement = field;
                }
            }

            if (errorElement) {
                errorElement.scrollIntoView({ block: "center", behavior: "smooth" });
            }

            resolve("validation completed");
        })
        .catch(error => {
            console.error(error);
            reject("error");
        });
}



function ConfigSender(blockID) {

    this.root = document.getElementById(blockID);
    this.body = {};

    var inputs = this.root.querySelectorAll('input');
    var action = document.querySelector('[name="action"]').value;
    var spinner = document.getElementById('config-progress');
    inputs.forEach(item => {

        var name = item.getAttribute("name");

        if (!name.includes("output")) {
            // item.oninput = debounce(
            //     (function() {
            //         this.body[name] = item.value;
            //         this.send();
            //     }).bind(this), 
            //     500);
            item.oninput = (function() { 
                this.body[name] = item.value;
                spinner.style.opacity = '1';
                send.call(this);
            }).bind(this);
        }
    });

    function send() {
        fetch('/clients/calc?type=config', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(Object.assign({ action: action }, this.body)),
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            spinner.style.opacity = '0';
        })
        .catch(error => {
            console.error(error);
            spinner.style.opacity = '0';
        });
    }
}

var configSender = new ConfigSender("config1");

//var submitted = virtualForm.dispatchEvent(new Event('submit'));