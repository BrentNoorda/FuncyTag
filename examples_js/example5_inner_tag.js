/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div');

function build_example_html()
{
    function inner_tag(height) // embed inner tags until height reaches 0
    {
        return div( { cssFontSize_px:height, cssMarginLeft_px:2.5*height },
                 'begin height ' + height,
                 (height > 1) ? inner_tag(height-1) : undefined,
                 'end height ' + height
               );
    }
    return String( inner_tag(20) );
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
