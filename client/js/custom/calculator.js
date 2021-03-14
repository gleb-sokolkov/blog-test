import { clampString, clampStringFloat } from '../functions';
import { SnackbarClosable, SnackbarTimeout } from './snackbar';
const debounce = require('debounce');


var virtualForm = document.getElementById("virtual-form");
var calcProgress = document.getElementById('calc-progress');
var configArray, clientInfo, downloadSnackbar, validationSnackbar;

if (virtualForm) {
    var genkp = virtualForm.querySelector("[name='gen-kp']");
    var genvr = virtualForm.querySelector("[name='gen-vr']");

    configArray = new ConfigSenderArray();
    clientInfo = new ClientInfo(virtualForm);
    downloadSnackbar = new SnackbarClosable("download");
    validationSnackbar = new SnackbarTimeout('validation-alert', 5000);

    genkp.addEventListener('click', () => createKP(
        'gen-kp',
        clientInfo.action,
        {
            client: clientInfo.update().body,
            config: configArray.ToValidationForm(),
        },
    ));
    genvr.addEventListener('click', () => createVR(
        'gen-vr',
        clientInfo.action,
        {
            client: clientInfo.update().body,
            config: configArray.ToValidationForm(),
        },
    ));
}

async function createVR(type, action, data) {

    calcProgress.classList.add("actived");
    downloadSnackbar.parent.hide();
    downloadSnackbar.parent.clear();
    validationSnackbar.hide();

    var valid = await sendClientInfoToValidation(action, data);

    if (valid) {
        var blob = await sendInfoToGenPDF(type, action, data);
        var url = window.URL.createObjectURL(blob);

        downloadSnackbar.setTitleText('Готово!');
        downloadSnackbar.parent.setBodyText('Ваш договор на ВР успешно сгенерирован.');
        downloadSnackbar.parent.addDownload(url, 'vr.pdf');
        downloadSnackbar.parent.addShowButton(url, "Открыть");
        downloadSnackbar.parent.show();
    }
    else {
        validationSnackbar.show();
    }

    calcProgress.classList.remove("actived");
}

async function createKP(type, action, data) {

    calcProgress.classList.add("actived");
    downloadSnackbar.parent.hide();
    downloadSnackbar.clear();
    validationSnackbar.hide();

    var valid = await sendClientInfoToValidation(action, data);

    if (valid) {
        var blob = await sendInfoToGenPDF(type, action, data);
        var url = window.URL.createObjectURL(blob);

        downloadSnackbar.setTitleText('Готово!');
        downloadSnackbar.parent.setBodyText('Ваш КП успешно сгенерирован.');
        downloadSnackbar.parent.addDownload(url, 'kp.pdf');
        downloadSnackbar.parent.addShowButton(url, "Открыть");
        downloadSnackbar.parent.show();
    }
    else {
        validationSnackbar.show();
    }

    calcProgress.classList.remove("actived");
}


async function sendInfoToGenPDF(type, action, data) {

    var blob = await fetch(`/clients/calc?type=${type}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(Object.assign({ action }, data)),
    }).then(res => res.blob());

    return blob;
}

function sendClientInfoToValidation(action, data) {

    return new Promise((resolve, reject) => {
        fetch('/clients/calc?type=validation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(Object.assign({ action }, data)),
        })
            .then(res => res.json())
            .then(res => {

                var errorElement;
                clientInfo.clientInput.forEach(item => {
                    var value = res.client[item.getAttribute("name")];
                    item.classList.remove("is-valid", "is-invalid");
                    item.classList.add(value ? "is-invalid" : "is-valid");

                    if (!errorElement && value) {
                        errorElement = item;
                    }
                });

                configArray.validate(res.config);

                if (!errorElement) {
                    configArray.bodyWrapper.scrollIntoView({ block: "center", behavior: "smooth" });
                }
                else {
                    errorElement.scrollIntoView({ block: "center", behavior: "smooth" });
                }

                resolve(res.isValid);
            })
            .catch(error => {
                console.error(error);
                reject(false);
            });
    });
}

function ClientInfo(root) {
    this.body = {};
    this.root = root;
    this.clientInput = this.root.querySelectorAll('.client input');
    this.action = this.root.querySelector('[name="action"]').value;

    this.update = function () {
        this.clientInput.forEach(item => {
            var name = item.getAttribute('name');
            this.body[name] = {
                value: item.value,
                type: item.getAttribute('type'),
            };
        });
        return this;
    };

    this.update();
}

function AddDeleteGroup(root) {

    this.root = root.querySelector('.delete-group');
    this.cancel = this.root.querySelector('.cancel');
    this.addButton = root.querySelector('.add');

    this.itemsChecker = {
        body: [],
        selected: {
            count: 0,
            view: this.root.querySelector('.selected'),
            increment() {

                this.view.innerHTML = ++this.count;
                this.currentReceiver(this);
            },
            decrement() {

                this.count = Math.max(--this.count, 0);
                this.view.innerHTML = this.count;
                this.currentReceiver(this);
            },
            update(item) {

                if (item.checked) {

                    this.increment();
                }
                else {

                    this.decrement();
                }
            },
            clear() {
                this.count = 0;
                this.view.innerHTML = this.count;
                this.currentReceiver(this);
            },
            currentReceiver: (selected) => { },
        },
        selectAll: this.root.querySelector('.select-all'),
        clearAll: this.root.querySelector('.select-clear'),
        all: this.root.querySelector('.all'),
        init(array) {

            this.body = array;
            this.all.innerHTML = `(${this.body.length})`;
            this.bind();
            this.selected.clear();
        },
        prepare(ev) {

            var item = ev.currentTarget.item;
            var context = ev.currentTarget.context;

            context.selected.update(item);
        },
        All(ev) {

            var context = ev.currentTarget.context;

            context.body.forEach(item => {

                if (!item.checked) {

                    item.checked = true;
                    context.selected.update(item);
                }
            });
        },
        clearSelect(ev) {

            var context = ev.currentTarget.context;

            context.body.forEach(item => {

                if (item.checked) {

                    item.checked = false;
                    context.selected.update(item);
                }
            });
        },
        bind() {

            this.body.forEach((function (item) {

                item.addEventListener('input', this.prepare, false);
                item.item = item;
                item.context = this;
            }).bind(this))

            this.selectAll.addEventListener('click', this.All, false);
            this.selectAll.context = this;

            this.clearAll.addEventListener('click', this.clearSelect, false);
            this.clearAll.context = this;
        },
        clear() {

            this.body.forEach(item => {

                item.removeEventListener('input', this.prepare, false);
                item.checked = false;
            });

            this.selectAll.removeEventListener('click', this.All, false);
            this.clearAll.removeEventListener('click', this.clearSelect, false);

            this.selected.clear();
        },
    };

    this.deleteButton = {
        element: root.querySelector('.delete'),
        emitted: false,
        emit() {

            this.emitted = true;
            this.element.classList.remove("actived");
            this.element.classList.add("actived");
        },
        clear() {

            this.emitted = false;
            this.element.disabled = false;
            this.element.classList.remove("actived");
        },
        changeActivity(selected) {

            if (selected.count === 0) {

                this.element.disabled = true;
            }
            else {

                this.element.disabled = false;
            }
        },
    };

    this.itemsChecker.selected.currentReceiver = this.deleteButton.changeActivity.bind(this.deleteButton);

    this.add = function (callback) {

        this.addButton.addEventListener('click', callback);
    };

    this.delete = function (start, result) {

        this.deleteButton.element.addEventListener('click', (function () {

            if (!this.deleteButton.emitted) {

                this.itemsChecker.init(start());

                this.root.classList.remove("actived")
                this.root.classList.add("actived");
                this.deleteButton.emit();
            }
            else {

                this.root.classList.remove("actived");
                result(this.itemsChecker.body);
                this.itemsChecker.clear();
                this.deleteButton.clear();
            }

        }).bind(this));

        this.cancel.addEventListener("click", (function () {

            this.root.classList.remove("actived");
            this.itemsChecker.clear();
            this.deleteButton.clear();
            result();
        }).bind(this));
    };
}
//ConfigSender[] wrapper with useful methods
function ConfigSenderArray() {

    this.root = document.querySelector('.server-config');
    this.bodyWrapper = this.root.querySelector('#body-wrapper');

    this.senders = [];

    this.new = function () {

        var template = config.content.cloneNode(true);
        this.bodyWrapper.appendChild(template);
        this.senders.push(new ConfigSender(Math.floor(Math.random() * 1000000), this.bodyWrapper.lastElementChild));
        this.senders.forEach((item, index) => item.changeIndex(index));
    };

    this.blockAll = function () {

        return this.senders.map(item => item.block());
    };

    this.deleteItems = function (checkedItems) {

        if (checkedItems === undefined) {

            this.senders.forEach(item => item.unblock());
            return;
        }

        var toDelete = [];
        var toUpdate = [];

        for (var i = 0; i < this.senders.length; ++i) {

            if (i >= checkedItems.length) {

                toUpdate.push(this.senders[i]);
                continue;
            }

            if (checkedItems[i].checked) {
                toDelete.push(this.senders[i]);
            }
            else {
                toUpdate.push(this.senders[i]);
            }
        }

        toDelete.forEach(item => item.root.remove());
        toUpdate.forEach((item, index) => {

            item.unblock();
            item.changeIndex(index);
        });

        toDelete = [];

        this.senders = toUpdate;
    };

    this.ToValidationForm = function () {

        var json = {};
        this.senders.forEach((item, i) => {
            json[i] = item.body;
        });
        return json;
    };

    this.validate = function (response) {

        for (var i = 0; i < this.senders.length; ++i) {
            this.senders[i].validate(response['' + i]);
        }
    };

    this.addDeleteGroup = new AddDeleteGroup(this.root);
    this.addDeleteGroup.add(this.new.bind(this));
    this.addDeleteGroup.delete(this.blockAll.bind(this), this.deleteItems.bind(this));
}
function ConfigSender(id, root) {

    this.root = root;

    this.id = id;
    this.serverNumber = this.root.querySelector('[name="serverNumber"]');
    this.serverNumber.innerHTML = this.id;

    var collapseButton = this.root.querySelector('[name="collapse-button"]');
    collapseButton.setAttribute('data-target', `#server${this.id}`);
    collapseButton.setAttribute('aria-controls', `server${this.id}`);

    var collapseContent = this.root.querySelector('[name="collapse-content"]');
    collapseContent.setAttribute('id', `server${this.id}`);

    var action = document.querySelector('[name="action"]').value;
    this.headings = this.root.querySelectorAll('input[role="heading"]');
    this.inputs = this.root.querySelectorAll('input[role="input"]');
    this.prices = this.root.querySelectorAll('[role="price"]');
    this.outputs = this.root.querySelectorAll('input[role="output"]');
    this.perMonth = this.root.querySelector('[name="perMonth"]');
    var spinner = document.getElementById('config-progress');


    this.body = {
        config: {},
        perMonth: '',
    };
    this.setBodyConfig = function (name, value, type) {
        this.body.config[name] = {
            value: value,
            type: type,
        };
        return this;
    };
    this.setBodyPrice = function (name, value) {
        this.body.config[name].price = value;
        return this;
    };
    this.setBodyMonth = function (value) {
        this.body.perMonth = value;
        return this;
    };
    this.withSend = function () {

        spinner.classList.add("actived");

        this.sendConfig()
            .then(res => {
                spinner.classList.remove("actived");
            }).catch(err => {
                spinner.classList.remove("actived");
            });

        return this;
    };


    var bodyName = this.root.querySelector('.body-name');

    this.deleteControlContainer = bodyName.querySelector('[name="delete-control"]');
    this.deleteControlContainer.children[0].setAttribute('id', `delete-control${this.id}`);
    this.deleteControlContainer.children[1].setAttribute('for', `delete-control${this.id}`)
    this.deleteControl = this.deleteControlContainer.children[0];


    this.headings.forEach(item => {

        var name = item.getAttribute("name");
        this.setBodyConfig(name, item.value, item.getAttribute("type"));

        item.oninput = debounce(() => {
            if (item.min || item.max) {
                if (item.dataset.type === "int") {
                    item.value = clampString(item.value, item.min, item.max);;
                }
                else if (item.dataset.type === "float") {
                    item.value = clampStringFloat(item.value, item.min, item.max);;
                }
            }
            this.setBodyConfig(name, item.value, item.getAttribute("type"))
                .withSend();
        }, 1000);
    });

    for (var i = 0; i < this.inputs.length; ++i) {
        const input = this.inputs[i];
        const output = this.outputs[i];

        var inputName = input.getAttribute("name");
        this.setBodyConfig(inputName, input.value, input.getAttribute("type"));

        input.oninput = debounce((function (name) {
            this.setBodyConfig(name, input.value, input.getAttribute("type"))
                .withSend();
            output.value = input.value;
        }).bind(this, inputName), 1000);

        output.oninput = debounce((function (name, out) {
            out.value = clampString(out.value, 0, out.max);
            input.value = out.value;
            this.setBodyConfig(name, input.value, input.getAttribute("type"))
                .withSend();
        }).bind(this, inputName, output), 1000);
    }

    this.sendConfig = function () {
        return new Promise((resolve, reject) => {
            fetch('/clients/calc?type=config', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(Object.assign({ action: action }, { config: this.body.config, })),
            })
                .then(res => res.json())
                .then(res => {

                    //console.log(res);
                    //partials
                    this.prices.forEach(item => {
                        var configName = item.getAttribute("for");
                        var value = res.config[item.getAttribute("name")];
                        item.innerHTML = value;
                        this.setBodyPrice(configName, value);

                        if (value === "Договорная") {
                            item.nextElementSibling.style.display = "none";
                        }
                        else {
                            item.nextElementSibling.style.display = "inline";
                        }
                    });

                    //per month
                    this.perMonth.innerHTML = res.perMonth;
                    this.setBodyMonth(res.perMonth);
                    //this.setBody("perMonth", res.perMonth, "no-validate");

                    resolve("success config");
                })
                .catch(error => {
                    console.error(error);
                    reject("error")
                });
        });
    }



    this.block = function () {

        this.root.classList.remove("block");
        this.root.classList.add("block");
        bodyName.classList.remove("block");
        bodyName.classList.add("block");

        this.deleteControlContainer.style.display = "block";

        return this.deleteControl;
    };

    this.unblock = function () {

        this.root.classList.remove("block");
        bodyName.classList.remove("block");
        this.deleteControlContainer.style.display = "none";
    };

    this.changeIndex = function (index) {

        this.serverNumber.innerHTML = index;
    };

    this.validate = function (response) {

        this.inputs.forEach(item => {
            var value = response[item.getAttribute("name")];
            item.classList.remove("is-invalid", "is-valid");
            item.classList.add(value ? "is-invalid" : "is-valid");
        });

        this.headings.forEach(item => {
            var value = response[item.getAttribute("name")];
            item.classList.remove("is-invalid", "is-valid");
            item.classList.add(value ? "is-invalid" : "is-valid");
        });

    };
}

function PhysicSender(id) {

    this.physicForm = document.getElementById(id);
    if (!this.physicForm) return {};

    this.inputs = this.physicForm.querySelectorAll(".config input");
    this.action = this.physicForm.querySelector("input[name='action']").value;
    this.progress = document.getElementById('calc-progress');
    this.spinner = document.querySelector('.physic .config-progress');
    this.prices = this.physicForm.querySelectorAll('[role="price"]');
    this.perMonth = this.physicForm.querySelector('[name="perMonth"]');
    this.genkp = this.physicForm.querySelector('[name="gen-kp"]');
    this.genvr = this.physicForm.querySelector('[name="gen-vr"]');
    this.body = {
        config: {},
        perMonth: ''
    };
    this.withSend = function () {

        this.spinner.classList.add("actived");

        this.sendToConfiguration()
            .then(res => {
                this.spinner.classList.remove("actived");
            }).catch(err => {
                this.spinner.classList.remove("actived");
            });

        return this;
    };
    this.setBodyConfig = function (name, value, type) {
        this.body.config[name] = {
            value: value,
            type: type,
        };

        return this;
    };
    this.setBodyPrice = function (name, value) {
        this.body.config[name].price = value;
        return this;
    };

    this.inputs.forEach(item => {

        const name = item.getAttribute("name");

        this.setBodyConfig(name, item.value, item.getAttribute("name"));

        item.addEventListener('input', debounce(() => {
            if (item.max || item.min) {
                if (item.dataset.type === "int") {
                    item.value = clampString(item.value, item.min, item.max);;
                }
                else if (item.dataset.type === "float") {
                    item.value = clampStringFloat(item.value, item.min, item.max);;
                }
            }
            this.setBodyConfig(name, item.value, item.getAttribute("name")).withSend();
        }, 1000))
    });

    this.genkp.addEventListener('click', () => this.KP(
        'gen-kp',
        this.action,
        this.body,
    ));

    this.genvr.addEventListener('click', () => this.VR(
        'gen-vr',
        this.action,
        this.body,
    ));

    this.sendToValidation = function () {

        return new Promise((resolve, reject) => {
            fetch("/clients/calc?type=validation", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(Object.assign({ config: this.body.config }, { action: this.action })),
            })
                .then(res => res.json())
                .then(res => {

                    var firstErrorElement;
                    this.inputs.forEach(item => {

                        var value = res.config[item.getAttribute("name")];
                        item.classList.remove("is-valid", "is-invalid");
                        item.classList.add(value ? "is-invalid" : "is-valid");

                        if (!firstErrorElement && value) {
                            firstErrorElement = item;
                        }
                    });

                    firstErrorElement?.scrollIntoView({
                        block: "center",
                        behavior: "smooth"
                    });

                    resolve(res.isValid);
                })
                .catch(error => {
                    console.error(error);
                    reject(false);
                });
        });
    };

    this.sendToConfiguration = function () {
        return new Promise((resolve, reject) => {
            fetch("/clients/calc?type=config", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(Object.assign(
                    { action: this.action },
                    { config: this.body.config },
                )),
            })
                .then(res => res.json())
                .then(res => {

                    this.prices.forEach(item => {
                        var configName = item.getAttribute("for");
                        var value = res.config[item.getAttribute("name")];
                        item.innerHTML = value;
                        this.setBodyPrice(configName, value);
                    });

                    this.perMonth.innerHTML = res.perMonth;
                    this.body.perMonth = res.perMonth;

                    resolve("success config");
                })
                .catch(err => {
                    console.error(err);
                    reject("error");
                });
        });
    };

    this.KP = async function (type, action, data) {

        calcProgress.classList.add("actived");
        downloadSnackbar.parent.hide();
        downloadSnackbar.clear();
        validationSnackbar.hide();

        var valid = await this.sendToValidation(action, data);

        if (valid) {
            var blob = await sendInfoToGenPDF(type, action, data);
            var url = window.URL.createObjectURL(blob);

            downloadSnackbar.setTitleText('Готово!');
            downloadSnackbar.parent.setBodyText('Ваш КП успешно сгенерирован.');
            downloadSnackbar.parent.addDownload(url, 'kp.pdf');
            downloadSnackbar.parent.addShowButton(url, "Открыть");
            downloadSnackbar.parent.show();
        }
        else {
            validationSnackbar.show();
        }

        calcProgress.classList.remove("actived");
    }

    this.VR = async function (type, action, data) {

        calcProgress.classList.add("actived");
        downloadSnackbar.parent.hide();
        downloadSnackbar.clear();
        validationSnackbar.hide();

        var valid = await this.sendToValidation(action, data);

        if (valid) {
            var blob = await sendInfoToGenPDF(type, action, data);
            var url = window.URL.createObjectURL(blob);

            downloadSnackbar.setTitleText('Готово!');
            downloadSnackbar.parent.setBodyText('Ваш Договор на ВР успешно сгенерирован.');
            downloadSnackbar.parent.addDownload(url, 'vr.pdf');
            downloadSnackbar.parent.addShowButton(url, "Открыть");
            downloadSnackbar.parent.show();
        }
        else {
            validationSnackbar.show();
        }

        calcProgress.classList.remove("actived");
    }
}

var physicSender = new PhysicSender("physic-form");
