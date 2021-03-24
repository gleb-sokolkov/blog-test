function UpComponent(id) {
    this.root = document.querySelector(`.${id}`);
    
    window?.addEventListener('scroll', () => {
        if(document.body.scrollTop > window.innerHeight*0.5 || document.documentElement.scrollTop > window.innerHeight*0.5) {
            this.root.classList.add('actived');
        }
        else {
            this.root.classList.remove('actived');
        }
    });

    this.root.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    });
}

var upComponent = new UpComponent('up-button'); 