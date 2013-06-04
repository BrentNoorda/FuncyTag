[FuncyTag](https://github.com/BrentNoorda/FuncyTag) Python Tutorial
=========

This is a step-by-step introduction to the features of FuncyTag in Python. This tutorial is also available as a [FuncyTag Javascript Tutorial](JAVASCRIPT_TUTORIAL.md).

* [1: basic use](#1)
* [2a: setting attributes: funcyTag dictionary == html attributes](#2a)
* [2b: setting attributes with dict()](#2b)
* [3: cssCamelStyles](#3)
* [4: unit suffixes](#4)
* [5: attribute list and None values](#5)
* [6: default attributes](#6)
* [7: inheritance](#7)
* [8: no attributes dictionary](#8)
* [9: multiple inner arguments for multiple inner tags](#9)
* [10: behavior-modifying options "\_nobrin" and "\_nobrout"](#10)
* [11: other types of inner elements, None, arrays, and functions](#11)
* [12: escaping strings](#12)
* [more reading](#more)

<a name="1"></a>
### LESSON 1: basic use

A minimal use of funcyScript create HTML will look something like this simple example:

    def make_html_snippet():
        div=funcyTag('div')
        p=funcyTag('P')

        t = div( {},
                 p( {}, 'hello world' )
        )
        return unicode(t)

resulting in this html:

    <div>
      <P>
        hello world
      </P>
    </div>

Notice that FuncyTag comes with no tags built-in; you must define them within your code. In the above example only the P and the DIV tags were used, and so that was all we defined

Note that in all following examples we'll skip the many of the common parts of the above example (e.g. calling "make\_html\_snippet", and calling unicode(t) at the end), and just present the relevant code. E.G. the above example for this tutorial could be shortened as:

    div=funcyTag('div'); p=funcyTag('P');

    div( {},
         p( {}, 'hello world' )
    )

<a name="2a"></a>
### LESSON 2a: setting attributes: funcyTag dictionary == html attributes

The first parameter to any funcyTag is a python dictionary. The key/value pairs of that dictionary translate to the attributes of that html tag. For example:

    div=funcyTag('div'); p=funcyTag('P')

    div( { 'align':'right', 'style'="margin-top:12px" },
         p( {'style':"font-size:120%;color:red;"}, 'hello world' )
    )

creates this html

    <div align="right" style:"margin-top:12px">
      <P style="font-size:120%;color:red;">
        hello world
      </P>
    </div>

<a name="2b"></a>
### LESSON 2b: setting attributes with dict()

Some users may prefer the look of using dict() to make the attributes dictionary, because it avoids using extra quotation marks and might look a little more like the attr='setting' that is seen in HTML. The following code, using dict(), outputs exactly the same as the previous example.

    div=funcyTag('div'); p=funcyTag('P')

    div( dict( align='right', style="margin-top:12px" ),
         p( dict(style="font-size:120%;color:red;"), 'hello world' )
    )

In the following examples, we'll sometimes use the {'attr':value} format and sometimes the dict(attr=value) formats interchangeably.

<a name="3"></a>
### LESSON 3: cssCamelStyles

It becomes tedious to create those "style=" strings in python. "style=" can usually be simplified in FuncyScript by setting tag properties that start with "css" and use "CamelCase" to represent the "blah-blah" types usually used in CSS. When funcyTag sees a property "cssFooBar" it becomes a style property "foo-bar". So the previous example can be rewritten as

    div=funcyTag('div'); p=funcyTag('P')

    div( dict( align='right', cssMarginTop="12px" ),
         p( dict(cssFontSize="120%", cssColor="red"), 'hello world' )
    )

to create the same html as the previous example:

    <div align="right" style="margin-top:12px">
      <p style="font-size:120%;color:red">
        hello world
      </p>
    </div>

<a name="4"></a>
### LESSON 4: unit suffixes

Another tedious python process, of appending units to attribute and css values, is achieved in FuncyScript by adding a "_unitSuffix" to the dictionary key name.  For example, instead of 'cssMarginLeft:"2em"' you could use 'cssMarginLeft_em:2'.  This is a direct translation for most units (e.g. 'em', 'px', 'pc'...) but for '%' you may use the suffix '_pct'.

So, again, the previous example can now be written as:

    div=funcyTag('div'); p=funcyTag('P')

    div( { 'align':'right', 'cssMarginTop_px':12 },
         p( {'cssFontSize_pct':120, 'cssColor':"red"}, 'hello world' )
    )

creating the exact same html as the previous two examples:

    <div align="right" style="margin-top:12px">
      <P style="font-size:120%;color:red">
        hello world
      </P>
    </div>

Note: An empty unit suffix can be a convenient way to allow a keyword to be used as a property. e.g. { class_:'foo' }.

<a name="5"></a>
### LESSON 5: attribute list and None values

Some common HTML and CSS values are represented as space-delimited strings. For example, in an HTML tag it is common to specify multiple CSS class (e.g. class="btn giant") and within CSS values such as "margin: 0 10px 0 12px" are common. In FuncyScript, if an attribute value is a list then the values are concatenated with spaces (and include the unit suffixes described in lesson 4).

Sometimes you may also not know until runtime if an attribute is needed at all (for example, only the "danger" class is needed if the danger flag is set). If an attribute value is <code>None</code> then that attribute will not be set.

The previous example, modified with such lists and None:

    danger = False
    div=funcyTag('div'); p=funcyTag('P')

    div( { 'align':'right', 'cssMargin_px':[12,0,4,0], 'scoobydoo':None },
         p( {'class':['big','red','danger' if danger else None]}, 'hello world' )
    )

creates this HTML:

    <div align="right" style="margin:12px 0px 4px 0px">
      <P class="big red">
        hello world
      </P>
    </div>

<a name="6"></a>
### LESSON 6: default attributes

A second, optional, parameter is available to funcyTag() to specify a default attribute dictionary. All uses of that generated funcyTag will have these options by default (or can override them, or can see the default values as tag.default_attributes).

Modifying the previous code to make a new funcytag called "bigredP" demonstrates this:

    div=funcyTag('div')
    bigredP=funcyTag( 'p', dict(cssFontSize_pct=120,cssColor='red') );

    div( {},
         bigredP( {}, 'hello world' )
    )

creates this HTML:

    <div>
      <p style="color:red;font-size:120%;">
        hello world
      </p>
    </div>

<a name="7"></a>
### LESSON 7: inheritance

New funcyTags can be created based on existing funcyTags (if the first parameter is a funcyTag instead of a string), and will inherit (or can overide) their attributes. The previous example can be redone in this way:

    div = funcyTag('div')
    p = funcyTag('p')
    redp = funcyTag( p, {'cssColor':'red'} )
    bigredP = funcyTag( redp, {'cssFontSize_pct':120} )

    div( {},
         bigredP( {}, 'hello world' )
    )

creates this familiar HTML:

    <div>
      <p style="color:red;font-size:120%;">
        hello world
      </p>
    </div>

<a name="8"></a>
### LESSON 8: no attributes dictionary

If the attributes dictionary is empty, it does not need to be passed in.  So in either of the two previous examples:

    div(
         bigredP( 'hello world' )
    )

would still generate this HTML:

    <div>
      <p style="color:red;font-size:120%;">
        hello world
      </p>
    </div>

<a name="9"></a>
### LESSON 9: multiple inner arguments for multiple inner tags

So far all of the examples have been a simple tag within a tag. It's far more common for HTML tags to contain multiple inner elements. The same thing is achieved in a similar way in FuncyTag by including multiple arguments to a funcyTag.

Take this list code, for example:

    div = funcyTag('div'); ul = funcyTag('ul'); li = funcyTag('li'); i = funcyTag('i')

    div(
         ul( 'the stooges were',
             li('larry'),
             li('moe'),
             li('curly'),
             li('shemp',i('not my favorite')),
             li('joe',i('who?'))
         )
    )

which generates this HTML:

    <div>
      the stooges were
      <ul>
        <li>
          larry
        </li>
        <li>
          moe
        </li>
        <li>
          curly
        </li>
        <li>
          shemp
          <i>
            not my favorite
          </i>
        </li>
        <li>
          joe
          <i>
            who?
          </i>
        </li>
      </ul>
    </div>

<a name="10"></a>
### LESSON 10: behavior-modifying options "\_nobrin" and "\_nobrout"

Sometimes, for cosmetic or true output reasons, you may not want all of those spaces and newlines added to the output. In your attributes dictionary you can add the option "\_nobrin:true" if you don't want newline and whitespace breaks on the inside of a tag. "\_nobrout:true" can be used to remove such newlines and breaks from the outside of a tag.

If we change the previous javascript to this (with the use of \_nobrin and \_nobrout)

    div = funcyTag('div'); ul = funcyTag('ul')
    li = funcyTag('li',{'_nobrin':True})
    i = funcyTag('i',{'_nobrin':True,'_nobrout':True})

    div(
         ul( 'the stooges were',
             li('larry'),
             li('moe'),
             li('curly'),
             li('shemp',i('not my favorite')),
             li('joe',i('who?'))
         )
    );

The HTML output is now a cleaner:

    <div>
      the stooges were
      <ul>
        <li>larry</li>
        <li>moe</li>
        <li>curly</li>
        <li>shemp<i>not my favorite</i></li>
        <li>joe<i>who?</i></li>
      </ul>
    </div>

Note: the alert reader will realize that this HTML output will not put any space between "joe" and "who?". That could be fixed with many options, including

    li( 'joe', ' ', i('who?') )

or

    li( 'joe' + ' ' + str(i('who?')) )

<a name="11"></a>
### LESSON 11: other types of inner elements, None, arrays, and functions

There can be many types of elements passed among the multiple arguments to a FuncyTag. We have seen examples of those arguments being a string or another funcy tag. Other argument types of special interst are:

* None: if an argument is None then no inner element will be added there

* list: if an argument is a list, then every element of that list will be added in place (or not placed if it is None)

* function: in an argument is a function, then it will be called and should return an argument of the types defined above:

Let's change the stooges code to use some of these rules:

    div = funcyTag('div'); ul = funcyTag('ul'); li = funcyTag('li',{'_nobrin':True})

    def lesser_knowns():
        return [ li('shemp'), None, li('joe') ]

    div(
         'the best known stooges were',
         ul( [ li('larry'), li('moe'), None, li('curly') ] ),
         'while the lesser-known stooges were',
         ul( dict(cssFontStyle='italic'), lesser_knowns() )
    )

producing this html:

    <div>
      the best known stooges were
      <ul>
        <li>larry</li>
        <li>moe</li>
        <li>curly</li>
      </ul>
      while the lesser-known stooges were
      <ul style="font-style:italic;">
        <li>shemp</li>
        <li>joe</li>
      </ul>
    </div>

<a name="12"></a>
### LESSON 12: escaping strings

If you're displaying html based on strings that have come from external sources, then you need to be careful that those strings don't contain character sequences that might be misinterpreted by html or, worse, might contain code injection that could expose data or cause harm to your site or your users.

Some templating engines escape all strings automatically. With FuncyTag the assumption is that most of the strings you are creating are safe, and only a few might come from external sources.  You should see to it that all such strings are escaped for HTML before passing them to funcyTags.

For convenience, FuncyTag provides the funcyTag.esc() method to escape such strings, as demonstrated in the javascript code:

    div=funcyTag('div'); p=funcyTag('p'); input=funcyTag('input'); br=funcyTag('br');
    esc = funcyTag.esc;

    div(
      p( "the following math equation has less-than and greater-than signs:",
         esc(' a<b>c')
      ),
      br(),
      'weird characters in value',input({'type':'input','value':esc('"dog" & "pony"')})
    )

which generates this safe html:

    <div>
      <p>
        the following math equation has less-than and greater-than signs:
         a&lt;b&gt;c
      </p>
      <br/>
      weird characters in value
      <input type="input" value="&quot;dog&quot; &amp; &quot;pony&quot;"/>
    </div>

<a name="more"></a>
### more reading

That completes this FuncyScript Python Tutorial. For more reading see:
* [FuncyTag README](README.md)
* [FuncyTag Javascript Tutorial](JAVASCRIPT_TUTORIAL.md)
* [FuncyTag on GitHub](https://github.com/BrentNoorda/FuncyTag)
* [a bunch of online javascript examples](http://dl.dropbox.com/u/41075/funcytagexamples/examples_js.html)