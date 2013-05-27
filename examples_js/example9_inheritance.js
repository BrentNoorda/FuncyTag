/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div'), ul=funcyTag('ul'), li=funcyTag('li',{_nobrin:true}),
    span=funcyTag('span',{_nobrout:true,_nobrin:true});

var good_li = funcyTag( li, {cssColor:'green'} ),
    bad_li = funcyTag( li, {cssColor:'red'} ),
    green = funcyTag( span, {cssColor:'green'} ),
    red = funcyTag( span, {cssColor:'red'} ),
    big = funcyTag( span, {cssFontSize_pct:150} );

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

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};