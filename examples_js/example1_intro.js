/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var p=funcyTag('P');

function build_example_html()
{
    var t;
    t = p( { id:'outty', style:'font-size:200%;color:red;' },
           "I'm a little teacup, short and stout."
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};