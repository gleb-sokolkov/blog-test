let navElements = document.querySelectorAll(".nav.nav-scrollable");
for (const item of navElements) {
    item.addEventListener("click", (e)=> {
        e.preventDefault();
        window.scrollTo(0, 0);
    });
}