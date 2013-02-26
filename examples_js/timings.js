/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, funcyTag, alert */

// this sample is used to get timing of various ways using funcyTag, to test the suspicion
// that it's not particularly fast.  You can change the following parameters to test
// various method
var HOW_MANY_TIMES_TO_CALL = 10000;

var tr=funcyTag('tr'), td=funcyTag('td'), esc=funcyTag.esc;

function build_book_row_via_pure_js(book)
{
    var t = tr(
                td( esc(book.title) ),
                td( esc(book.author) ),
                td( { cssColor:book.rating > 3 ? 'green' : 'red'}, book.rating )
            );
    return String(t);
}

var _template = String(tr(
                    td( '$<title>$' ),
                    td( '$<author>$' ),
                    td( { cssColor:'$<rating-color>$' }, '$<rating>$' )
                ));
function build_book_row_via_cache_replace(book)
{
    return _template.replace('$<title>$',esc(book.title)).
                     replace('$<author>$',esc(book.author)).
                     replace('$<rating-color>$',book.rating > 3 ? 'green' : 'red').
                     replace('$<rating>$',book.rating);
}

function run_test(which_method)
{
    var startTime, endTime, i, html,
        book = { title:"Under the Bleachers", author:"Seymor Butts", rating:3 };

    startTime = new Date();

    if ( which_method === 'pure-js' )
    {
        for ( i = HOW_MANY_TIMES_TO_CALL; i--; )
        {
            html = build_book_row_via_pure_js(book);
            //$('#book-rows').append(html);
        }
    }
    else if ( which_method === 'cache-replace' )
    {
        for ( i = HOW_MANY_TIMES_TO_CALL; i--; )
        {
            html = build_book_row_via_cache_replace(book);
            //$('#book-rows').append(html);
        }
    }
    else
    {
        alert("unknown which_method");
    }

    endTime = new Date();
    alert("It took " + (endTime - startTime)/1000.0 + " seconds to run " + HOW_MANY_TIMES_TO_CALL +
          " calls via method " + which_method);
}

$(document).ready(function() {
    run_test('pure-js');
    run_test('cache-replace');
});
