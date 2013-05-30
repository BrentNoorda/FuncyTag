/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, alert */

var div = funcyTag( 'div' );
var box = funcyTag( 'div',
                    { cssBorderStyle:'solid',
                      cssWidth_px:80,
                      cssHeight_px:80,
                      cssFloat:'left',
                      cssPadding_em: 0.3,
                      onmouseover: function(id,data,elem,evt) {
                        elem.style.backgroundColor = 'black';
                        elem.style.color = 'white';
                      },
                      onmouseout: function(id,data,elem,evt) {
                        elem.style.backgroundColor = 'white';
                        elem.style.color = 'black';
                      },
                      onclick: function(id,data,elem,evt) {
                        elem.innerHTML = p('box ' + data.idx) + p(++data.clicked + ' clicks');
                      } } );
var clear = funcyTag( div, { cssClear:'both' } );
var p = funcyTag( 'p' );

function build_example_html()
{
    var t;

    function lotsa_boxes(count)
    {
        var i, ret = [];
        for ( i = 0; i < count; i++ )
        {
            ret.push( box( {data:{idx:i,clicked:0}},
                           p('box ' + i),
                           p('0 clicks')
                      )
                    );
        }
        return ret;
    }

    t = div(
          lotsa_boxes(20),
          clear()
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};