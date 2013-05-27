/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag */

var div=funcyTag('div'), p=funcyTag('P');

function count_to_ten()
{
    var i, ret = [];
    for ( i = 1; i <= 10; i++ )
    {
        ret.push(i);
    }
    return ret;
}

function build_example_html()
{
    var t;
    t = div({},
          p({},'regular paragraph 1'),
          [ p({},'Paragraph 1 in array'), undefined, p({},'Paragraph 2 in array'), p({},'Paragraph 3 in array') ],
          p({},'regular paragraph 2'),
          [ ],  // empty array results in nothing
          p({},'regular paragraph 3'),
          count_to_ten(),
          p({},'regular paragraph 4')
        );
    return String(t);
}

window.onload = function() {
    document.getElementById('container').innerHTML = build_example_html();
};