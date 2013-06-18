/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div'), p=funcyTag('p');
var color = funcyTag.color;

function build_example_html()
{
    var t;

    t = funcyTag.color(0x332211);
    t.mix(1,1);


    t = div(
            p( { cssColor: color(0xFF0000) }, 'red' ),
            p( { cssColor: color('#0F0') }, 'green' ),
            p( { cssColor: color('#0000FF') }, 'blue' ),
            p( { cssColor: color([255,0,0,0.5]) }, 'opaque red' ),
            p( { cssColor: color([0x0000FF,0.5]) }, 'opaque blue' )
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};