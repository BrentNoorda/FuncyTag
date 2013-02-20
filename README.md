FuncyTag
=========

FuncyTag makes HTML look like function calls, so it looks familiar to a functional programmer (nesting, parameters, etc...). Optimized only for easy reading/writing by humans. Not quite an html template language, but kinda. Available in javascript and python.

quick example
--------------

In HTML you might create code something like this:

    <div id="master-block" class="goober">
        <p style="color:red;font-size:120%;">
            What shall I name this <b id="animal">cat</b>?
        </p>
        <img width="40" height="40" src="http://pets.org/cat/23423423.jpg">
    </div>

The same html can be generated in FuncyTag javascript with:

    div( { id:"master-block", _class:"goober" },
        p( { cssColor:"red", cssFontSize:"120%" },
            'What shall I name this ', b( {id:"animal"}, "cat" ), '?'
        ),
        img( { width:40, height:40, src:"http://pets.org/cat/23423423.jpg" } )
    );

or in FuncyTag python with:

    div( { 'id':"master-block", 'class':"goober" },
        p( { 'cssColor':"red", 'cssFontSize':"120%" },
            'What shall I name this ', b( {'id':"animal"}, "cat" ), '?'
        ),
        img( { 'width':40, 'height':40, 'src':"http://pets.org/cat/23423423.jpg" } )
    );

Looks like Javascript (or python), parses like Javscript (or python), renders like HTML.

more examples
---------------
The examples in this can be run directly from the clone of examples.html, or a [live version of examples.html](http://dl.dropbox.com/u/41075/funcytagexamples/examples.html).


status
--------------
Nothing to see here yet. I'm just trying to figure out how to use github and markdown and stuff, to tell you the truth.

similar tools
---------------------

If you're not satisifed with FuncyTag, there are many similar tools, with different reasons for being:

* [Farof/jhtml](https://github.com/Farof/jhtml) - this is most similar
* [tekrat/eSugar](https://github.com/tekrat/eSugar)
* [mrak/js2dom](https://github.com/mrak/js2dom)
* [nrn/flates](https://github.com/nrn/flates)
* [markrendle/moist.js](https://github.com/markrendle/moist.js)
* [reissbaker/html-sourcery](https://github.com/reissbaker/html-sourcery)
* [richjddavis/elephactory](https://github.com/richjddavis/elephactory)
* [robrobbins/RML](https://github.com/robrobbins/RML)
* [webmat/sugar_dom](https://github.com/webmat/sugar_dom)

or you might just be satisfied with jquery(html,attributes). For a discussion of the topic see [Building HTML in jQuery and JavaScript](http://marcgrabanski.com/articles/building-html-in-jquery-and-javascript).

them song
-----------------------

Towlie remembers the FuncyTag theme [here](http://www.youtube.com/watch?v=4OrVrrsjqwQ).