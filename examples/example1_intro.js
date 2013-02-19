/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var p=funcyTag('P');

function build_example_html()
{
    var t;
    t = p( { id:'outty', style:'font-size:200%;color:red;' },
           "I'm a little teacup, short and stout."
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
