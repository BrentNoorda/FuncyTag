/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div'), ul=funcyTag('ul'), li=funcyTag('li'), span=funcyTag('span');

// create a good_li tag that is a green <li>, and bad_li tag that is red
var good_li = funcyTag( 'li', {cssColor:'green'} ),
    bad_li = funcyTag( 'li', {cssColor:'red'} );

var green = funcyTag('span',{cssColor:'green',_nobr_outer:true,_nobr_inner_:true});

function build_example_html()
{
    var t;
    t = div({},
          'foods: ', green({},'like'), ',', span({cssColor:'red'},'hate,'), 'or indifferent',
          ul({},
            li({},'rice'),
            bad_li({},'okra'),
            good_li({},'pizza'),
            good_li({},'ice cream'),
            bad_li({},'dog poop'),
            li({},'chicken')
          )
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
