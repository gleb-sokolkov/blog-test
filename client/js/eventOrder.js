import { _onScroll } from './scroller'
import { onScroll } from './three/blocks'

var scrollContainer = document.getElementById("scroll-container");
var scroller = document.getElementById("scroller");

scrollContainer.addEventListener('scroll', () => {
    _onScroll(scrollContainer, scroller);
    onScroll(scrollContainer, scroller);
});