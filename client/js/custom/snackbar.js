function Snackbar(id) {
    this.root = document.getElementById(id);
    this.body = this.root.querySelector('.body');
    this.bodyText = this.body.querySelector('.text');
    this.buttonGroup = this.body.querySelector('.button-group');
    
    this.show = function () {
        this.root.classList.add("actived");
    };

    this.hide = function () {
        this.root.classList.remove("actived");
    };

    this.clear = function () {
        this.setBodyText('');
        //clear all links
        this.body.querySelectorAll('a, button').forEach(item => item.remove());
    };

    this.setBodyText = function (text) {
        this.bodyText.innerHTML = text;
    };

    this.addDownload = function (url, filename) {
        var template = downloadButton.content.cloneNode(true);
        var a = template.querySelector('a');
        a.href = url;
        a.download = filename;
        template.querySelector('.text').innerHTML = "Cкачать файл";
        this.buttonGroup.appendChild(template);
    };

    this.addShowButton = function(url, buttonText){
        var template = showButton.content.cloneNode(true);
        var button = template.querySelector('button');
        button.querySelector('.text').innerHTML = buttonText;
        button.addEventListener('click', (e) => {
            window.open(url, "_blank");
        });
        this.buttonGroup.appendChild(template);
    };
}

function SnackbarClosable(id) {
    this.parent = new Snackbar(id);
    this.titleText = this.parent.root.querySelector('.menu .title > .text');
    this.close = this.parent.root.querySelector('.menu .close');
    this.close.addEventListener('click', () => { this.parent.hide() });

    this.setTitleText = function (text) {
        this.titleText.innerHTML = text;
    };

    this.clear = function () {
        this.parent.clear();
        this.setTitleText('');
    };
}

function SnackbarTimeout(id, showTime) {
    this.parent = new Snackbar(id);
    this.showTime = showTime;
    this.current = null;

    this.setShowTime = function (showTime) {
        this.showTime = showTime;
    };

    this.show = function () {
        if (this.current) clearTimeout(this.current);
        this.parent.show();
        this.current = setTimeout(() => {
            this.parent.hide();
        }, this.showTime);
    };

    this.hide = function() {
        if(this.current) clearTimeout(this.current);
        this.parent.hide();
    };

    this.showWithClear = function () {
        if (this.current) clearTimeout(this.current);
        this.parent.show();
        this.current = setTimeout(() => {
            this.parent.hide();
            this.parent.clear();
        }, this.showTime);
    }
}

export { SnackbarClosable, SnackbarTimeout };