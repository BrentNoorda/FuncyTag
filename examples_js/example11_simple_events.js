/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, alert */

var div = funcyTag( 'div' ), br = funcyTag('br');
var box = funcyTag( 'div',
                    { cssBorderStyle:'solid',
                      cssWidth_px:100,
                      cssHeight_px:100,
                      cssFloat:'left',
                      onmouseover: function(id,data,elem,evt) {
                        elem.style.backgroundColor = 'black';
                        elem.style.color = 'white';
                      },
                      onmouseout: function(id,data,elem,evt) {
                        elem.style.backgroundColor = 'white';
                        elem.style.color = 'black';
                      },
                      onclick: function(id,data,elem,evt) {
                        elem.innerHTML = 'box ' + data.idx + br() + (++data.clicked) + ' clicks';
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
            ret.push( box( {data:{idx:i,clicked:0}},
                           'box ' + i,
                           br(),
                           '0 clicks'
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