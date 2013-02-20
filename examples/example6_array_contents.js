/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div'), p=funcyTag('P');

function build_example_html()
{
    var t;
    t = div( {},
          p({},'regular paragraph 1'),
          [ p({},'Paragraph 1 in array'), undefined, p({},'Paragraph 2 in array'), p({},'Paragraph 3 in array') ],
          p({},'regular paragraph 2'),
          [ ],  // empty array results in nothing
          p({},'regular paragraph 3')
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
