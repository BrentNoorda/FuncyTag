/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div');

function build_example_html()
{
    var t;
    t = div( { id:'outer', style:'font-size:20px;color:red;' },
          'begin outer div',
          div( { id:'middle', style:'font-size:16px;color:green;margin-left:12px;' },
            'begin middle div',
            div( { id:'inner', style:'font-size:12px;color:blue;margin-left:12px;' },
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