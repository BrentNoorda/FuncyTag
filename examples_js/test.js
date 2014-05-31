/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, alert*/

var div = funcyTag('div');
var p=funcyTag('p'), span=funcyTag('span');
var red = funcyTag( span, { 'cssColor':'red' } );
var blue = funcyTag( span, { 'cssColor':'blue' } );
var fluffy = funcyTag( span,
                       { oninit: function(elem) {
                           var scale = 100, direction = 1;
                           setInterval( function() {
                             scale += direction;
                             if ( scale <= 100  ||  150 <= scale ) {
                                direction *= -1;
                             }
                             elem.style.fontSize = scale + '%';
                           }, 10 );
                         },
                         onclick: function(elem,evt) {
                            alert("you clicked me");
                         }
                       } );

function build_example_html()
{
    var t;
    t = div( {cssPosition:'relative',cssHeight_em:3},
        div( {cssPosition:'absolute', cssBottom:0, cssLeft:0 },
        p( red( 'Red peeps' ),
           'are',
           fluffy( 'fluffier and',
                   red( 'redder' ) ),
           'than',
            blue( 'blue peeps.') )
        )
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};