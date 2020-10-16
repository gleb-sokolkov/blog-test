if(window.navigator.userAgent.match(/MSIE|Trident/) === null)
{
    AllowDrodown("dd-new", "dd-old");
}
else
{
    AllowDrodown("dd-old", "dd-new");
}

function AllowDrodown(visible, unvisible)
{
    var navbar = document.getElementById("navbar");
    var visibleNavItems = navbar.getElementsByClassName(visible);
    var unvisibleNavItems = navbar.getElementsByClassName(unvisible);


    if(visibleNavItems !== null)
    {
        for (let i = 0; i < visibleNavItems.length; i++) {
            const element = visibleNavItems[i];
            element.style.display = "inline-block";    
        }
    }
    if(unvisibleNavItems !== null)
    {
        for (let i = 0; i < unvisibleNavItems.length; i++) {
            const element = unvisibleNavItems[i];
            element.style.display = "none";
        }
    }
}