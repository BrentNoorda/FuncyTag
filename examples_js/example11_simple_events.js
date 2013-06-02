/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, alert */

var div = funcyTag( 'div', { _noslfcls:true } );
var p = funcyTag( 'p' );
var box = funcyTag( 'div',
                    { cssBorderStyle:'solid',
                      cssWidth_px:80,
                      cssHeight_px:80,
                      cssFloat:'left',
                      cssPadding_em: 0.3,
                      cssCursor: 'pointer',
                      onmouseover: function(elem,evt) {
                        elem.style.backgroundColor = 'black';
                        elem.style.color = 'white';
                      },
                      onmouseout: function(elem,evt) {
                        elem.style.backgroundColor = 'white';
                        elem.style.color = 'black';
                      },
                      onclick: function(elem,evt) {
                        elem.innerHTML = p('box ' + this._idx) + p(++this._clicked + ' clicks');
                      } } );
var clear = funcyTag( div, { cssClear:'both' } );

function build_example_html()
{
    var t;

    function lotsa_boxes(count)
    {
        var i, ret = [];
        for ( i = 0; i < count; i++ )
        {
            ret.push( box( { _idx:i, _clicked:0 },
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