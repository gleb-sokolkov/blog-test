let navElements = document.querySelectorAll(".nav.nav-scrollable");
for (let i = 0; i < navElements.length; i++) {
    const element = navElements[i];
    element.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
    });
}