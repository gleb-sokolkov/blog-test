var scrollContainer = document.getElementById("scroll-container");
var scroller = document.getElementById("scroller");

scrollContainer.addEventListener('scroll', function() {
    _onScroll(scrollContainer, scroller);
    onScroll(scrollContainer, scroller);
});