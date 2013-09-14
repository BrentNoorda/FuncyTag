/*jslint white:false plusplus:false browser:true nomen:false */
// make iframes fit their contents, at least vertically

function growIframe(el) {
    try {
        el.style.height = el.contentWindow.document.body.offsetHeight + 50 + 'px';
    } catch(e) { }
}
