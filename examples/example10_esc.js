/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div'), p=funcyTag('p'), input=funcyTag('input'), br=funcyTag('br');
esc = funcyTag.esc;

function build_example_html()
{
    var t;
    t = div(
          p( "the following math equation has less-than and greater-than signs:",
            esc(' a<b>c')
          ),
          br(),
          'weird characters in value',input({type:'input',value:esc('"dog" & "pony"')})
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
