/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div'), p=funcyTag('p');
var color = funcyTag.color;

function build_example_html()
{
    var t, c;

    t = div(
            p( { cssColor: c = color(0xFF0000) }, 'color(0xFF0000) = red = ' + c),
            p( { cssColor: c = color('#0F0') }, "color('#0F0') = green = " + c),
            p( { cssColor: c = color('#0000FF') }, "color('#0000FF') = blue = " + c),
            p( { cssColor: c = color(255,0,0,0.5) }, "color(255,0,0,0.5) = opaque red = " + c),
            p( { cssColor: c = color('#00ff00',0.5) }, "color('#00ff00',0.5) = opaque green = " + c),
            p( { cssColor: c = color(0x0000FF,0.5) }, "color(0x0000FF,0.5) = opaque blue = " + c),
            p( { cssColor: c = color(0xff0000).add(color(0x0000ff)) }, 'color(0xff0000).add(color(0x0000ff)) = red+blue = magenta = ' + c),
            p( { cssColor: c = color(0xff00).sub(color(0x888888)) }, 'green - gray = dark green = ' + c),
            p( { cssColor: c = color(0xff0000).mix(color(0x00ff00),0.75) }, 'color(0xff0000).mix(color(0x00ff00),0.75) = 75%red,25%green = ' + c),
            p( { cssColor: c = color(0xff0000).mix(color(0x00ff00),0.60).mix(color(0x0000ff),0.50) }, "c = color(0xff0000).mix(color(0x00ff00),0.60).mix(color(0x0000ff),0.50) = 30%red,20%green,50%blue = " + c),
            p( { cssColor: c = c.g(0) }, 'c = c.g(0) (remove green) = ' + c ),
            p( { cssColor: c = c.b(0) }, 'c = c.b(0) (remove blue) = ' + c),
            p( { cssColor: c = c.a(0.5) }, 'c = c.a(0.5) (set opacity to 0.5) = ' + c)
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};