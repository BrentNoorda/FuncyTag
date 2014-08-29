/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, funcyStyle*/

var p=funcyTag('p'), i=funcyTag('i'), span=funcyTag('span');

var bigSize = 1.5;
funcyStyle( '#css-demo', {
                '.red': { color:'red' },
                '#blue': { color:'blue' },
                i: { fontSize_em: bigSize, fontStyle:'normal' }
            }
          );

function build_example_html()
{
    var t;
    t = p( { id:'css-demo' },
           span( {class_:'red'}, 'Red peeps' ),
           'are',
           i( 'bigger and',
              span( {class_:'red'}, 'redder' ) ),
           'than',
            span( {id:'blue'}, 'blue peeps.') );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};