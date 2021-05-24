import debounce from 'debounce';
//                   xl    lg   md   sm
const BREAKPOINTS = [1200, 992, 768, 576];
const UPDATE_DELAY = 500;

//BP - breakpoint
class GalleryGrid {
    constructor(arr, schema, initUpdate = true) {
        this.root = document.querySelector('.gallery-grid');
        this.iteratorIndex = 0;
        this.currentBP = 0;
        this.oldBP = 0;
        this.schema = schema.map(item => parseInt(item)) //must have a length equals to 4 for every single breakpoint
            .slice(0, 5)
            .sort((a, b) => a > b ? -1 : 1)
            .map(item => Math.max(item, 1)); //we dont want to able logic for non-positive and zero values 

        this.maxColumns = this.schema[0];

        this.schema = this.schema.reduce((accum, item, index) => {
            accum[item] = BREAKPOINTS[index];
            return accum;
        }, {});

        this.createColumns();
        this.addElements(arr);
        this.bindResize();

        if (initUpdate) {
            this.updateCurrentBP();
            this.setVisibility();
        }
    }

    createColumns() {
        this.columns = Array(this.maxColumns).fill('').map(item => {
            let column = document.createElement('div');
            column.classList.add('gallery-column');
            column.classList.add('active');
            this.root.appendChild(column);
            return column;
        });
        this.activeColumns = this.columns;
    }

    addElements(elems) {
        if (!Array.isArray(elems)) {
            return;
        }
        elems.filter(e => e instanceof Node)
            .forEach(item => {
                this.iteratorIndex %= this.activeColumns.length;
                this.activeColumns[this.iteratorIndex++].appendChild(item);
            });
    }

    deleteElements(elems) {
        if (!Array.isArray(elems)) {
            return;
        }
        elems.filter(e => e instanceof Node)
            .forEach(elem => this.activeColumns.forEach(column => {
                if (column.contains(elem)) {
                    column.removeChild(elem);
                }
            }));
        this.sort();
    }

    updateCurrentBP() {
        this.oldBP = this.currentBP;
        for (const [key, value] of Object.entries(this.schema)) {
            if (Math.min(document.documentElement.clientWidth, BREAKPOINTS[0]) <= value) {
                this.currentBP = parseInt(key);
                return;
            }
        }
    }

    updateColumns() {
        this.updateCurrentBP();
        if (this.currentBP !== this.oldBP) {
            this.setVisibility();
            this._sort();
        }
    }

    setVisibility() {
        this.columns.forEach(item => item.classList.remove('active'));
        this.activeColumns = this.columns.slice(0, this.currentBP);
        this.activeColumns.forEach(item => item.classList.add('active'));
    }

    sort() { //изменить порядок сортировки, потому что сейчас она выглядит не очень
        let flatArray = [];
        this.columns.forEach(column => column.childNodes.forEach(item => {
            flatArray.push(item);
        }));

        let lastIndex = flatArray.filter(e => e instanceof Node)
            .reduce((lastIndex, item, index) => {
                lastIndex = index % this.activeColumns.length;
                this.activeColumns[lastIndex].appendChild(item);
                return lastIndex;
            });

        this.iteratorIndex = ++lastIndex;
    }

    _sort() {
        let lx = this.columns.length;
        let ly = Math.max(...this.columns.map(i => i.childNodes.length));
        const flatArray = [];
        for (let y = 0; y < ly; y++) {
            for (let x = 0; x < lx; x++) {
                const item = this.columns[x].childNodes[y];
                item && flatArray.push(item);
            }
        }

        let lastIndex = flatArray.filter(e => e instanceof Node)
        .reduce((lastIndex, item, index) => {
            lastIndex = index % this.activeColumns.length;
            this.activeColumns[lastIndex].appendChild(item);
            return lastIndex;
        });

        this.iteratorIndex = ++lastIndex;
    }

    bindResize() {
        window.onresize = debounce(this.updateColumns, UPDATE_DELAY).bind(this);
    }
}

export default GalleryGrid;