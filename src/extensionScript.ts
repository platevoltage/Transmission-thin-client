var timeout;
var isHidden = false;

document.addEventListener("mousemove", magicMouse);

function magicMouse() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
        if (!isHidden) {
            document.querySelector("html").style.cursor = "none";
        
            isHidden = true;
        }
    }, 5000);
    if (isHidden) {
        document.querySelector("html").style.cursor = "auto";
    
        isHidden = false;
    }
};