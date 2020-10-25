var sidenav = document.getElementById("sidenav");
var sidenavToggle = document.getElementById("sidenav-toggle");
var sidenavClose = document.getElementById("sidenav-close");
var servicePanel = document.getElementById("service-panel");
var bg = document.getElementById("sidenav-bg");

sidenavToggle.addEventListener('click', () => {
    sidenav.style.width = (window.innerWidth > 768) ? "45%" : "100%";
    sidenav.style.opacity = "1";
    servicePanel.style = "margin-right: 0%;";
    document.body.style.overflow = "hidden";
    bg.style.visibility = "visible";
    bg.style.opacity = "0.5";
});

sidenavClose.addEventListener('click', () => {
    sidenav.style.width = "0";
    sidenav.style.padding = "0 0";
    sidenav.style.opacity = "0";
    servicePanel.style = "margin-right: -20%;";
    document.body.style.overflow = "auto";
    bg.style.opacity = "0";
    bg.style.visibility = "hidden";
});
