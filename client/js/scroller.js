
var oldIndex = 0;


var expanders = document.getElementById("scroller").getElementsByClassName("expander");
var descriptions = document.getElementById("scroller").getElementsByClassName("short-description");
var descriptionContents = document.getElementById("scroller").getElementsByClassName("content");
var _oldScroll = 0;

export var _onScroll = (scrollContainer, scroller) => {
    var widthCounter = 0;
    var index = 0;
    var origin = scrollContainer.scrollTop + document.documentElement.clientHeight * 0.1;

    for (let i = 0; i < expanders.length; i++) {
        const element = expanders[i];
        widthCounter += element.clientHeight;
        if(widthCounter > origin)
        {
            index = i;
            break;
        }
    }

    var scrollDir = scrollContainer.scrollTop - _oldScroll;

    if(document.documentElement.clientWidth < 2000)
    {
        expanders[index].children[0].style.fontSize = "calc(2rem + 10vw)";
    }
    else
    {
        expanders[index].children[0].style.fontSize = "13rem";
    }
    descriptions[index].style.visibility = "visible";
    descriptionContents[index].style.marginTop = "0px";
    descriptions[index].style.opacity = "1";

    if(index != oldIndex)
    {
        expanders[oldIndex].children[0].style.fontSize = "2rem";
        descriptions[oldIndex].style.visibility = "hidden";
        descriptions[oldIndex].style.opacity = "0";
        
        if(scrollDir >= 0)
        {
            descriptionContents[oldIndex].style.marginTop = "-1000px";
        }
        else
        {
            descriptionContents[oldIndex].style.marginTop = "1000px";
        }

        oldIndex = index;
    }

    _oldScroll = scrollContainer.scrollTop;
};