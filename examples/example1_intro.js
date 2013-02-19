/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag */

function build_example_html()
{
    var tag, p=funcyTag('P'), br=funcyTag('BR'), input=funcyTag('input');
    tag = p( { id:'outty', cssFontSize:'200%', cssColor:'red' },
            'The test worked.',
             p( { id:'inny', cssBackroundColor:'yellow', cssFontSize:'80%' },
                'some',
                input( { type:'input', value:'def&amp;au&quot;lt value'} ),
                input( { type:'input', _value:'def&amp;au&quot;lt value'} ),
                // maybe the underscore means to escape it
                'more',
                br(),
                'text'
             )
          );
    return String(tag);
}

function main()
{
    $('#container').html( build_example_html() );
}

$(document).ready(function() {
    main();
});
