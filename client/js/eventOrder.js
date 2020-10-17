var threeBlocks = require("./three-blocks");
var scroll = require("./scroller");

var scrollContainer = document.getElementById("scroll-container");
var scroller = document.getElementById("scroller");

scrollContainer.addEventListener('scroll', function() {
    scroll._onScroll(scrollContainer, scroller);
    threeBlocks.onScroll(scrollContainer, scroller);
});