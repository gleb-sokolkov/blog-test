const debounce = require('debounce');
import GalleryGrid from "./gallery-grid";

class GalleryScroller {
    constructor() {
        this.root = document.querySelector('.gallery-scroller');
        this.page = this.root.dataset.current;
        this.size = this.root.dataset.size;
        this.fillImageArea()
            .then(this.bindScroll.bind(this))
            .then(item => {
                this.scroll = {
                    end: item.end,
                };
                this.scroll.end.bind();
            });
        this.imageGrid = new GalleryGrid([], [4, 3, 2, 1]);
        this.images = [];
    }

    async getImages(wishPage, pageSize) {
        try {
            const result = await fetch(`${window.location.href.split('?')[0]}?action=fetch&page=${wishPage}&size=${pageSize}`, {
                method: 'GET',
            }).then(res => res.json());
            this.page = result.current;
            this.size = result.size;
            this.first = result.first;
            this.last = result.last;
            this.amount = (this.last - this.first);
            this.next = result.next;
            this.previous = result.previous;
            this.imageMeta = result.images;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    drawImages() {
        const images = this.imageMeta.map(item => {
            const img = new ImageCard(item.body, item.title);
            this.images.push(img);
            return img.root;
        });

        this.imageGrid.addElements(images);
    }

    async fillImageArea() {
        const delay = 1000;
        while (!(this.amount + 1 < this.size ||
            this.isScrollable() ||
            this.next === false)) {
            await this.getImages(this.next || this.page, this.size)
                .then(this.drawImages.bind(this));
            await this.sleep(delay);
        }
    }

    bindScroll() {
        const delay = 1000;

        const end = debounce(() => {
            if (!this.isScrollEnds() || this.amount + 1 < this.size || !this.next) {
                return;
            }
            this.getImages(this.next, this.size)
                .then(this.drawImages.bind(this));
        }, delay);

        function Scroll(func) {
            this.func = func;
            this.bind = () => window.addEventListener('scroll', this.func);
            this.unbind = () => window.removeEventListener('scroll', this.func);
        }

        return Promise.resolve({
            end: new Scroll(end),
        });
    }

    isScrollable() {
        const hasScroll = this.root.scrollHeight > window.innerHeight;
        const hasHiddenOverflow = this.root.style.overflowY === "hidden";
        return hasScroll && !hasHiddenOverflow;
    }

    isScrollEnds() {
        return window.innerHeight + window.scrollY >= this.root.scrollHeight + this.root.offsetTop;
    }

    isScrollStart() {
        return window.scrollY <= this.root.offsetTop;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class ImageCard {
    constructor(url, title, subtext = '') {
        this.createImageTemplate();
        this.body = this.root.querySelector('.body');
        this.progress = this.root.querySelector('.progress');
        this.dtitle = this.root.querySelector('.info .title');
        this.dtitle.innerHTML = title;
        this.url = url;
        this.title = title;
        this.subtext = subtext;
        this.loadImage();
    }

    createImageTemplate() {
        this.root = imageCard.content.cloneNode(true);
        const id = Math.floor(Math.random() * 100000);
        const img = this.root.querySelector('.image-card');
        img.id = `img-${id}`;
        document.documentElement.appendChild(this.root);
        this.root = document.querySelector(`#${img.id}`);
    }

    loadImage() {
        this.img = document.createElement('img');
        this.img.src = this.url;
        this.img.alt = this.title;
        this.setState('loading');
        this.img.onload = this.setState.bind(this, 'loaded');
        this.img.onerror = this.setState.bind(this, 'failed');
        this.body.appendChild(this.img);
    }

    setState(state) {
        this.root.className = `image-card ${state}`;
    }
}

const scroller = new GalleryScroller();

// return new Promise(resolve => {
//     const intervalID = setInterval(async () => {
//         if (this.amount + 1 < this.size || this.isScrollable() || this.next === false) {
//             clearInterval(intervalID);
//             return resolve();
//         }
//         await this.getImages(this.next || this.page, this.size)
//             .then(this.drawImages.bind(this));
//     }, delay);
// });