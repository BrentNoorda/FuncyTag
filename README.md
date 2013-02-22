FuncyTag
=========

FuncyTag makes HTML look like function calls, so it looks familiar to a functional programmer (nesting, parameters, etc...). Optimized only for easy reading/writing by humans. Not quite an html template language, but kinda. Available in javascript and python.

### quick example

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

or in FuncyTag python with:

    div( { 'id':"master-block", 'class':"goober" },
        p( { 'cssColor':"red", 'cssFontSize_pct':120 },
            'What shall I name this ', b( {'id':"animal"}, "cat" ), '?'
        ),
        img( { 'width':40, 'height':40, 'src':"http://pets.org/cat/23423423.jpg" } )
    );

Looks like Javascript (or python), parses like Javscript (or python), renders like HTML.

------------------------------------------------------------------------------

# Tutorial

FuncyScript provides a method to create HTML snippets using pure javascript.

### LESSON 1: basic use

A minimal use of funcyScript create HTML will look something like this simple example:

    function make_html_snippet()
    {
        var div=funcyTag('div'), p=funcyTag('P');

        var t = div( {},
                     p( {}, 'hello world' )
                );
        return String(t);
    }

resulting in this html:

    <div>
      <p>
        hello world
      </p>
    </div>

Notice that funcyTags comes with no tags built-in; you must define them with in your code. In the above example only the P and the DIV tags were used, and so that was all we defined

Note that in all following example we'll skip the many of the common parts of the above example (e.g. use of "var", calling "make_html_snippet", and calling String(t) at the end, and just present the relevale code. E.G. the above example for this tutorial could be shortened as:

    div=funcyTag('div'), p=funcyTag('P');

    div( {},
         p( {}, 'hello world' )
    )


### LESSON 2: setting attributes: funcyTag option object == html attributes

The first parameter to any funcyTag is a javascript object. The properties of that object translate to the attributes of that html tag. For example:

    div=funcyTag('div'), p=funcyTag('P');

    div( { align:'right', style="margin-top:12px"},
         p( {style="font-size:120%;color:red;"}, 'hello world' )
    )

creates this html

    <div align="right" style="margin-top:12px">
      <p style="font-size:120%;color:red">
        hello world
      </p>
    </div>

### LESSON 3: cssCamelStyles

It becomes rather tedious to create those "style=" strings in javascript. "style=" can usually be simplified in funcyScript by setting tag properties that start with "css" and use "CamelCase" to represent the "blah-blah" types usually used in CSS. When funcyTag sees a property "cssFooBar" is becomes a Styles property "foo-bar". So the previous example can be rewritten as

    div=funcyTag('div'), p=funcyTag('P');

    div( { align:'right', cssMarginTop:"12px"},
         p( cssFontSize:"120%", cssColor:"red;"}, 'hello world' )
    )

creates the exact same html as the previous example:

    <div align="right" style="margin-top:12px">
      <p style="font-size:120%;color:red">
        hello world
      </p>
    </div>

### LESSON 4: unit suffixes

Another tedious javascript process, of appending units to attribute and css values, is achieved in funcyScript by adding a "_unitSuffix" to the attribute property name.  For example, instead of 'cssMarginLeft:"2em"' you could use 'cssMarginLeft_em:2'.  This is a directly translation for most units (e.g. 'em', 'px', 'pc'...) but for '%' you must use the suffix '_pct'.

So, again, the previous example can now be written as:

    div=funcyTag('div'), p=funcyTag('P');

    div( { align:'right', cssMarginTop_px:12},
         p( cssFontSize_pct:120, cssColor:"red;"}, 'hello world' )
    )

creating the exact same html as the previous two examples:

    <div align="right" style="margin-top:12px">
      <p style="font-size:120%;color:red">
        hello world
      </p>
    </div>


------------------------------------------------------------------------------

status
==============
Nothing to see here yet. I'm just trying to figure out how to use github and markdown and stuff, to tell you the truth.

------------------------------------------------------------------------------

similar tools
==============

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

------------------------------------------------------------------------------

theme song
-----------------------

Towlie remembers the FuncyTag theme [here](http://www.youtube.com/watch?v=4OrVrrsjqwQ).