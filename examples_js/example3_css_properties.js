/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag*/

var div=funcyTag('div');

function build_example_html()
{
    var t;
    t = div( { id:'outer', cssFontSize:'20px', cssColor:'red', cssMarginLeft:null },
          'begin outer div',
          div( { id:'middle', cssFontSize:'16px', cssColor:'green', cssMarginLeft:'12px' },
            'begin middle div',
            div( { id:'inner', cssFontSize:'12px', cssColor:'blue', cssMarginLeft:'12px' },
              'center div'
            ),
            'end middle div'
          ),
          'end outer div'
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};