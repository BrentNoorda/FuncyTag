/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div'), p=funcyTag('p');
var color = funcyTag.color;

function build_example_html()
{
    var t, c;

    t = div(
            p( { cssColor: color(0xFF0000) }, 'red' ),
            p( { cssColor: color('#0F0') }, 'green' ),
            p( { cssColor: color('#0000FF') }, 'blue' ),
            p( { cssColor: color(255,0,0,0.5) }, 'opaque red' ),
            p( { cssColor: color('#00ff00',0.5) }, 'opaque green' ),
            p( { cssColor: color(0x0000FF,0.5) }, 'opaque blue' ),
            p( { cssColor: color(0xff0000).add(color(0x00ff00)) }, 'red+green=yellow' ),
            p( { cssColor: color(0xff00).sub(color(0x888888)) }, 'green-gray=light green' ),
            p( { cssColor: color(0xff0000).mix(color(0x00ff00),0.75) }, '75%red,25%green' ),
            p( { cssColor: c = color(0xff0000).mix(color(0x00ff00),0.60).mix(color(0x0000ff),0.50) }, '30%red,25%green,50%blue' ),
            p( { cssColor: c = c.g(0) }, 'then remove green' ),
            p( { cssColor: c = c.b(0) }, 'then remove blue leaving r = ' + c.r()),
            p( { cssColor: c = c.a(0.5) }, 'then set opacity to 0.5')
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};