/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div'), ul=funcyTag('ul'), li=funcyTag('li',{_nobrin:true}),
    span = funcyTag('span',{_nobrout:true,_nobrin:true}),
    good_li = funcyTag( 'li', {_nobrin:true,cssColor:'green'} ),
    bad_li = funcyTag( 'li', {_nobrin:true,cssColor:'red'} ),
    green = funcyTag( 'span', {_nobrout:true,_nobrin:true,cssColor:'green'} ),
    red = funcyTag( 'span', {_nobrout:true,_nobrin:true,cssColor:'red'} ),
    big = funcyTag( 'span', {_nobrout:true,_nobrin:true,cssFontSize_pct:150} );

function build_example_html()
{
    var t;
    t = div(
          'foods: ' + green(big('L'),'ike') + ', ',
          red(big('H'),'ate'), ',', 'or ',big('I'),'ndifferent',
          ul(
            li('rice'),
            bad_li('okra'),
            good_li('pizza'),
            good_li('ice cream'),
            bad_li({cssFontStyle:'italic'},'dog poop'),
            li('chicken')
          )
        );
    return String(t);
}

$(document).ready(function() {
    $('#container').html( build_example_html() );
});
