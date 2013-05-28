/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div = funcyTag( 'div' );
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
                        alert("you clicked box " + data.idx);
                      } } );
var p = funcyTag( 'p' );

function build_example_html()
{
    var t;

    function lotsa_boxes(count)
    {
        var i, ret = [];
        for ( i = 0; i < count; i++ )
        {
            ret.push( box({data:{idx:i}},'I am box ' + i) );
        }
        return ret;
    }

    t = div(
          lotsa_boxes(20),
          p({cssClear:'both',id:'msg'},'message goes here')
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};