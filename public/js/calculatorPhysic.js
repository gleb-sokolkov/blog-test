function PhysicSender(id) {

    this.physicForm = document.getElementById(id);
    this.inputs = this.physicForm.querySelectorAll(".config input");
    this.action = this.physicForm.querySelector("input[name='action']").value;
    this.progress = document.getElementById('calc-progress');
    this.spinner = document.querySelector('.physic .config-progress');
    this.prices = this.physicForm.querySelectorAll('[role="price"]');
    this.perMonth = this.physicForm.querySelector('[name="perMonth"]');
    this.body = {};
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
    this.setBody = function (name, value, type) {
        this.body[name] = {
            value: value,
            type: type,
        };

        return this;
    }


    this.inputs.forEach(item => {

        const name = item.getAttribute("name");

        this.setBody(name, item.value, item.getAttribute("name"));

        item.addEventListener('input', () => {
            if (item.max || item.min) {
                if (item.dataset.type === "int") {
                    item.value = clampString(item.value, item.min, item.max);;
                }   
                else if (item.dataset.type === "float") {
                    item.value = clampStringFloat(item.value, item.min, item.max);;
                }
            }
            this.setBody(name, item.value, item.getAttribute("name")).withSend();
        })
    });

    this.physicForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        this.progress.classList.add("actived");

        this.sendToValidation()
            .then(res => {
                this.progress.classList.remove("actived");
            }).catch(error => {
                this.progress.classList.remove("actived");
            });
    });

    this.sendToValidation = function () {

        return new Promise((resolve, reject) => {
            fetch("/clients/calc?type=validation", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(Object.assign({ config: this.body }, { action: this.action })),
            })
                .then(res => res.json())
                .then(res => {

                    //console.log(res);
                    var firstErrorElement;
                    this.inputs.forEach(item => {

                        var value = res[item.getAttribute("name")];
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

                    resolve("success validation");
                })
                .catch(error => {
                    console.error(error);
                    reject("error")
                });
        });
    };

    this.sendToConfiguration = function () {
        return new Promise((resolve, reject) => {
            fetch("/clients/calc?type=config", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(Object.assign(
                    { action: this.action },
                    { config: this.body },
                )),
            })
                .then(res => res.json())
                .then(res => {
                    
                    this.prices.forEach(item => {
                        var value = res.partial[item.getAttribute('name')];
                        item.innerHTML = value;
                    });

                    this.perMonth.innerHTML = res.perMonth;

                    resolve("success config");
                })
                .catch(err => {
                    console.error(err);
                    reject("error");
                });
        });
    };
}

var physicSender = new PhysicSender("physic-form");

function clampString(str, a, b) {
    if (!str) return '';
    return Math.floor(Math.max(a, Math.min(str, b))).toString();
}

function clampStringFloat(str, a, b) {
    if (!str) return '';
    return Math.max(a, Math.min(str, b)).toString();
}