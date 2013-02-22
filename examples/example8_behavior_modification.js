/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div'), ul=funcyTag('ul'), li=funcyTag('li',{_nobrin:true}), span=funcyTag('span');

// create a good_li tag that is a green <li>, and bad_li tag that is red
var good_li = funcyTag( 'li', {_nobrin:true,cssColor:'green'} ),
    bad_li = funcyTag( 'li', {_nobrin:true,cssColor:'red'} );

var green = funcyTag('span',{cssColor:'green',_nobrout:true,_nobrin:true});
var red = funcyTag('span',{cssColor:'red',_nobrout:true,_nobrin:true});
var big = funcyTag('span',{cssFontSize_pct:200,_nobrout:true,_nobrin:true});

function xxxbuild_example_html()
{
    var t, d1 = funcyTag('div'), d2 = funcyTag('div'), d3 = funcyTag('div');
    //t = d1({id:1},d2({id:2},d3({id:3},'blah')));
    //t = d1({},d2({},'dog','cat'));
    t = d1(d2({}),String('kity'),'dog','cat')
    return String(t);
}

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
