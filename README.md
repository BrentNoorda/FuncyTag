FuncyTag
=========

FuncyTag is an HTML generator in pure javascript or python, primarily useful for programmaticly creating snippets of HTML to be embedded in a page at server-side or client-side. FuncyTag makes creating HTML look like function calls, so it looks familiar to a functional programmer (nesting, parameters, etc...). Optimized only for easy reading/writing by humans. Not quite an html template language, but kinda. Available in javascript and python.

Jump To:

* [quick example](#quick-example)
* [tutorials](#tutorials)
* [project status](#project-status)
* [more examples](#more-examples)
* [similar tools](#similar-tools)
* [theme song](#theme-song)

------------------------------------------------------------------------------

<a name="quick-example"/>
# quick example

In HTML you might create code something like this:

    <div id="master-block" class="goober">
        <p style="color:red;font-size:120%;">
            What shall I name this <b id="animal">cat</b>?
        </p>
        <img width="40" height="40" src="http://pets.org/cat/23423423.jpg">
    </div>

The same html can be generated in FuncyTag javascript with:

    div( { id:"master-block", class:"goober" },
        p( { cssColor:"red", cssFontSize_pct:120 },
            'What shall I name this ', b( {id:"animal"}, "cat" ), '?'
        ),
        img( { width:40, height:40, src:"http://pets.org/cat/23423423.jpg" } )
    );

or in FuncyTag python if you like { 'attr':value }:

    div( { 'id':"master-block", 'class':"goober" },
        p( { 'cssColor':"red", 'cssFontSize_pct':120 },
            'What shall I name this ', b( {'id':"animal"}, "cat" ), '?'
        ),
        img( { 'width':40, 'height':40, 'src':"http://pets.org/cat/23423423.jpg" } )
    )

or this python option if you prefer using dict(attr=value):

    div( dict( id="master-block", class_="goober" ),
        p( dict( cssColor="red", cssFontSize_pct=120 ),
            'What shall I name this ', b( dict(id="animal"), "cat" ), '?'
        ),
        img( dict( width=40, height=40, src="http://pets.org/cat/23423423.jpg" ) )
    )

Looks like Javascript (or python), parses like Javscript (or python), renders like HTML.

------------------------------------------------------------------------------

<a name="tutorials"/>
# Tutorials

These step-by-step tutorials introduce FuncyTag features by example:
* [FuncyTag Javascript Tutorial](JAVASCRIPT_TUTORIAL.md)
* [FuncyTag Python Tutorial](PYTHON_TUTORIAL.md)

------------------------------------------------------------------------------

<a name="project-status"/>
project status
==============
* version 0.0.1 released Feb 22, 2013. This is a first stab in hopes of getting some feedback from someone... anyone...
* version 0.0.2 released Feb 25, 2013. Add python version.

------------------------------------------------------------------------------

<a name="more-examples"/>
more examples
==============
* [a bunch of online javascript examples][javascript examples]

------------------------------------------------------------------------------

<a name="similar-tools"/>
similar tools
==============

If you're not satisifed with FuncyTag, there are many similar tools, with different reasons for being:

* [Farof/jhtml](https://github.com/Farof/jhtml) - very similar
* [edspencer/jaml](https://github.com/edspencer/jaml) - very similar
* [tekrat/eSugar](https://github.com/tekrat/eSugar)
* [mrak/js2dom](https://github.com/mrak/js2dom)
* [nrn/flates](https://github.com/nrn/flates)
* [markrendle/moist.js](https://github.com/markrendle/moist.js)
* [reissbaker/html-sourcery](https://github.com/reissbaker/html-sourcery)
* [richjddavis/elephactory](https://github.com/richjddavis/elephactory)
* [robrobbins/RML](https://github.com/robrobbins/RML)
* [webmat/sugar_dom](https://github.com/webmat/sugar_dom)

or you might just be satisfied with jquery(html,attributes). For a discussion of the topic see [Building HTML in jQuery and JavaScript](http://marcgrabanski.com/articles/building-html-in-jquery-and-javascript).

------------------------------------------------------------------------------

<a name="theme-song"/>
theme song
-----------------------

Towlie remembers the FuncyTag theme [here][theme song].

[javascript examples]: [http://dl.dropbox.com/u/41075/funcytagexamples/examples_js.html]
[theme song]: [http://www.youtube.com/watch?v=4OrVrrsjqwQ]