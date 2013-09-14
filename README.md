FuncyTag &amp; FuncyStyle
=========

<p style="color:red">THIS PROJECT IS IN TRANSITION. GO AWAY (but come back soon).</p>

FuncyTag is an HTML generator in pure javascript or python, primarily useful for programmaticly creating snippets of HTML to be embedded in a page at server-side or client-side. FuncyTag makes creating HTML look like function calls, so it looks familiar to a functional programmer (nesting, parameters, etc...). Optimized only for easy reading/writing by humans. Not quite an html template language, but kinda.

Jump To:

* [project page](http://brentnoorda.github.io/FuncyTag/)
* [quick example](#quick-example)
* [tutorials](#tutorials)
* [project status](#project-status)
* [more examples](#more-examples)
* [recommendations on when to use FuncyTag](#recommendations)
* [theme song](#theme-song)

------------------------------------------------------------------------------

<a name="quick-example"/></a>
# quick example

Suppose you need a javascript function to create HTML for each animal that looks something like this (with sizes and colors depending on input parameters):

    <div id="animal-3987" class="mammal">
      <p style="color:red;font-size:120%;">
        The <b>skulley lamprey</b> is a mammal and looks like this:
        <img width="80" height="80" src="/pix/3987.jpg">
      </p>
    </div>

A typical javascript function building such an HTML string may look like this:

    var imgSize = 80;

    function animal_html(genus,species,endangered,id)
    {
        return '<div id="animal-' + id + '" class="' + genus + '">\r\n' +
               '  <p style="color:' + (endangered?'red':'green') + ';' + (endangered?'font-size:120%;':'') + '">\r\n' +
               '    The <b>' + species + '</b> is a ' + genus + ' and looks like this:\r\n' +
               '    <img width="' + imgSize + '" height="' + imgSize + '" src="/pix/' + id + '.jpg">\r\n' +
               '  </p>\r\n' +
               '</div>';
    }

Here is the same function using FuncyTag, which makes HTML tags look and act like javascript functions:

    var imgSize = 80;

    function animal_html(genus,species,endangered,id)
    {
        var t;
        t = div( { id:'animal-'+id, class:genus },
                 p( { cssColor: endangered?'red':'green', cssFontSize_pct: endangered?120:undefined },
                    'The', b('species'), 'is a', genus, 'and looks like this:',
                    img( { width:imgSize, height:imgSize, src:'/pix/' + id + '.jpg' } )
                 )
            );
        return String(t);
    }

And the same function in python (using FuncyTag's dict() form):

    imgSize = 80;

    def animal_html(genus,species,endangered,id):
        t = div( dict( id='animal-%d'%id, class_=genus ),
                 p( dict( cssColor='red' if endangered else 'green', cssFontSize_pct=120 if endangered else None ),
                    'The', b('species'), 'is a', genus, 'and looks like this:',
                    img( dict( width=imgSize, height=imgSize, src='/pix/%d.jpg'%id ) )
                 )
            );
        return unicode(t);

By making HTML tags act like functions with their attributes set like script objects, allowing css <code>style</code> elements to bet set like any other attribute, and throwing in a few other bells and whistles (array, undefined/None, inheritance...), FuncyTag simplifies the creation of HTML strings in javascript and python.

------------------------------------------------------------------------------

<a name="tutorials"></a>
# tutorials

These step-by-step tutorials introduce FuncyTag features by example:

* [FuncyTag Javascript Tutorial](JAVASCRIPT_TUTORIAL.md)
* [FuncyTag Python Tutorial](PYTHON_TUTORIAL.md)

------------------------------------------------------------------------------

<a name="project-status"></a>
# project status

* version 0.0.1 released Feb 22, 2013. This is a first stab in hopes of getting some feedback from someone... anyone...
* version 0.0.2 released Feb 25, 2013. Add python version.
* version 0.0.3 released Feb 26, 2013. When attribute values are undefined/None, do not set the attribute.
* version 0.0.4 released ?????. Events????

------------------------------------------------------------------------------

<a name="more-examples"></a>
# more examples

* [a bunch of online javascript examples](http://brentnoorda.github.io/FuncyTag/examples_js.html)

------------------------------------------------------------------------------

<a name="recommendations"></a>
# recommendations on when to use FuncyTag

In general you could create all of your HTML via FuncyTag, but just because you can doesn't mean you should. In my experience, FuncyTag makes the most sense when you want to create just a relatively small sections of html based on runtime parameters, and you want that to be algorithmically flexible and really really easy to read.

One place where FuncyTag/Style may not be appropriate is when you are concerned with performance above all else, because FuncyTag/Style is not fast (compared to most other methods). Even so, the instances are probably rare when this performance would matter.

For instance, consider this javascript example that would build a row in a table of books, representing the author, title, and a user rating (color-coded based on a rating threshold). The function to build that row might look like this:

    function build_book_row(book)
    {
        var t = tr(
                    td( esc(book.title) ),
                    td( esc(book.author) ),
                    td( { cssColor:book.rating > 3 ? 'green' : 'red'}, book.rating )
                );
        return String(t);
    }

Calling that function 100,000 times in my browser (on an old machine) takes about 8 seconds.

Now consider this alternative, which only builds the template once, and then uses a simple <code>replace()</code> call to fill in fields each time (note the use of template strings such as <code>$&lt;title&gt;$</code> which are chosen because they cannot appear in raw html code).

    var _template = String( tr(
                        td( '$<title>$' ),
                        td( '$<author>$' ),
                        td( { cssColor:'$<rating-color>$' }, '$<rating>$' )
                    ) );
    function build_book_row(book)
    {
        return _template.replace('$<title>$',esc(book.title)).
                         replace('$<author>$',esc(book.author)).
                         replace('$<rating-color>$',book.rating > 3 ? 'green' : 'red').
                         replace('$<rating>$',book.rating);
    }

This replace version runs 100,000 times in about 0.45 seconds--about 17 times faster. That would be a big difference if you were making this call 100,000 times, but in a scenario that made this call only 10 times (for example, filling out a page of books in a web page in a browser) the performance difference between these methods, and even faster methods, would be difficult to measure (less than a millisecond, and imperceptible to any user).

Final recommendation: Unless you're in a situation where every microsecond will be noticed, pick the tool that makes the best use of your development time.

------------------------------------------------------------------------------

<a name="theme-song"></a>
# theme song

Towlie remembers the FuncyTag theme [here](http://www.youtube.com/watch?v=4OrVrrsjqwQ).
