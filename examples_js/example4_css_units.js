/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div');

function build_example_html()
{
    var t;
    t = div( { id:'outer', cssFontSize_px:20, cssColor:'red' },
          'begin outer div',
          div( { id:'middle', cssFontSize_px:16, cssColor:'green', cssMarginLeft_em:2 },
            'begin middle div',
            div( { id:'inner', cssFontSize_px:12, cssColor:'blue', cssMarginLeft_em:2 },
              'center div'
            ),
            'end middle div'
          ),
          'end outer div'
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
