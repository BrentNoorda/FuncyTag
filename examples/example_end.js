/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

var div=funcyTag('div');

function getRandomInt(bottom,top)  // inclusive
{
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function getRandomColor() // anywhere between #000000 and #FFFFFF
{
    return 'rgb(' + getRandomInt(0,200) + ',' + getRandomInt(0,255) + ',' + getRandomInt(0,255) + ')';
}

function build_example_html()
{
    function inner_tag(message)
    {
        if ( message.length === 0 ) { return undefined; }
        return div( { cssColor: getRandomColor(), cssMargin_em:[-0.6,0,0,0.75] },
                 message.charAt(0),
                 inner_tag(message.substring(1))
               );
    }
    return String( inner_tag("That's all, folks. Thanks for playing.") );
}

function display()
{
    $('#container').html( build_example_html() );
    setTimeout(display,100);
}

$(document).ready(function() {
    display();
});
