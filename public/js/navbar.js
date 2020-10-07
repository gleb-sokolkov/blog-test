function unobtrusify()
{
    var previousPosY = window.pageYOffset;
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => 
    {
        if(window.pageYOffset < previousPosY)
        {
            navbar.style.top = '0';
        }
        else
        {
            navbar.style.top = '-127px';            
        }
        previousPosY = window.pageYOffset;
    });
}

unobtrusify();