/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, console*/
/* FuncyStyle version 0.0.4 - see more at https://github.com/BrentNoorda/FuncyTag */

(function(window) {
    var gCamelToDashRegexp,
        recursive,
        DEBUG=true;

    // new stuff
    // _superAttr = null if no supertag
    // are we correctly handling it when _superAttr things within an array, for instances if it has classes to meld in? and events

    //can we add a help function funcyTag.find(id) to return the elem and its attributes? even creating object if we must? maybe? but how if it
    // doesn't go into xElem? _findable? if has data?
    // explain createElement
    // explain funcyStyle

    /*************** camel casing ***************/

    gCamelToDashRegexp = new RegExp('([A-Z])','g');

    function camel_to_dash(camel)
    // turn upper characters to -c, for example, "cssBackgroundColor" becomes "css-background-color"
    {
        return camel.replace(gCamelToDashRegexp,function(match,c,offset,string){
                return '-' + c.toLowerCase();
            });
    }

    /*************** utility functions ***************/

    function is_array(o) {  // from http://web.archive.org/web/20100424091244/http://www.ajaxdr.com/code/javascript-version-of-phps-is_array-function/
        if((o !== null) && (typeof o === 'object')) {
            return (typeof o.push === 'undefined') ? false : true;
        }else {
            return false;
        }
    }

    function isPlainObj(o) { // from http://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects
        return (typeof o === 'object') && (o.constructor === Object)  && !('_ft_render_' in o);
    }

    /*************** color helpers ***************/

    function InternalColor(rgba) {
        this._ = rgba;
    }

    // internally we know something is a color if it is an object with a _.r (._. has properties .r, .g, .b, .a)
    function color(args) { /* (clr), or ('#clr'), or (clr, opacity) or (r,g,b) or (r,g,b,a) */
        var rawrgb, r, g, b, a = 1.0;

        if ( 3 <= arguments.length )
        {
            r = arguments[0];
            g = arguments[1];
            b = arguments[2];
            if ( 4 <= arguments.length ) { a = arguments[3]; }
        }
        else
        {
            if ( 2 === arguments.length )
            {
                a = arguments[1];
            }
            rawrgb = arguments[0];
            if (((typeof rawrgb) === 'string') || (rawrgb instanceof String))
            {
                // the only types we understand are #hhh and #hhhhhh
                if ( rawrgb.length === 4 )
                {
                    rawrgb = '#' + rawrgb.substring(1,2) + rawrgb.substring(1,2) +
                                   rawrgb.substring(2,3) + rawrgb.substring(2,3) +
                                   rawrgb.substring(3,4) + rawrgb.substring(3,4);
                }
                r = parseInt(rawrgb.substring(1,3),16);
                g = parseInt(rawrgb.substring(3,5),16);
                b = parseInt(rawrgb.substring(5,7),16);
            }
            else
            {
                // this is an integer
                /*jslint bitwise:false */
                r = (rawrgb & 0xFF0000) >> 16;
                g = (rawrgb & 0xFF00) >> 8;
                b = (rawrgb & 0xFF);
                /*jslint bitwise:true */
            }
        }
        if ( r < 0 ) { r = 0; }
        if ( g < 0 ) { g = 0; }
        if ( b < 0 ) { b = 0; }
        if ( 255 < r ) { r = 255; }
        if ( 255 < g ) { g = 255; }
        if ( 255 < b ) { b = 255; }
        if ( a < 0.0 ) { a = 0.0; }
        if ( 1.0 < a ) { a = 1.0; }
        return new InternalColor( {r:r,g:g,b:b,a:a} );
    }

    InternalColor.prototype.mix = function(color2,ratio) { // ratio of color1/result - 0.75 meanst 75% color1
        var ratio2 = 1.0 - ratio;
        return color( Math.round(this._.r*ratio+color2._.r*ratio2),
                      Math.round(this._.g*ratio+color2._.g*ratio2),
                      Math.round(this._.b*ratio+color2._.b*ratio2),
                      Math.round(this._.a*ratio+color2._.a*ratio2) );
    };
    InternalColor.prototype.add = function(color2) {
        return color( this._.r+color2._.r,this._.g+color2._.g,
                      this._.b+color2._.b,(this._.a+color2._.a)/2 );
    };
    InternalColor.prototype.sub = function(color2) {
        return color( this._.r-color2._.r,this._.g-color2._.g,
                      this._.b-color2._.b,(this._.a+color2._.a)/2 );
    };
    InternalColor.prototype.toString = function() {
        var a = this._.a;

        function hex(c)
        {
            if ( c < 16 ) { return '0' + c.toString(16); }
            else { return c.toString(16); }
        }

        if ( 1.0 <= a )
        {
            return '#' + hex(this._.r) + hex(this._.g) + hex(this._.b);
        }
        else
        {
            return 'rgba(' + this._.r + "," + this._.g + "," + this._.b + "," + this._.a + ')';
        }
    };
    InternalColor.prototype.r = function(setClr) {
        if ( arguments.length )
        {
            return color(setClr,this._.g,this._.b,this._.a);
        }
        return this._.r;
    };
    InternalColor.prototype.g = function(setClr) {
        if ( arguments.length )
        {
            return color(this._.r,setClr,this._.b,this._.a);
        }
        return this._.g;
    };
    InternalColor.prototype.b = function(setClr) {
        if ( arguments.length )
        {
            return color(this._.r,this._.g,setClr,this._.a);
        }
        return this._.b;
    };
    InternalColor.prototype.a = function(setClr) {
        if ( arguments.length )
        {
            return color(this._.r,this._.g,this._.b,setClr);
        }
        return this._.a;
    };
    /*************** build style ***************/

    /*
        many ways to use funcyStyle

        variables

            no brainer (that's what scripting language does best)

        nesting

            funcyStyle('table.h1',{ margin_em:[2 0], 'td.ln': funcyStyle('td.ln',{textAlign:'right'}} })

            borrowing from the less example,

              funcyStyle( '#header', {
                            h1: { fontSize_px: 26,
                                  fontWeight: 'bold'
                            },
                            p: { fontSize_px: 12,
                                 a: { textDecoration: 'none',
                                   '&hover': { borderWidth_px: 1 }
                                 }
                            }
                          }
                        )

            leads to this css

                #header h1 {
                  font-size: 26px;
                  font-weight: bold;
                }
                #header p {
                  font-size: 12px;
                }
                #header p a {
                  text-decoration: none;
                }
                #header p a:hover {
                  border-width: 1px;
                }

        mixins

            handled by calling functions that return array (or object) of attributes

        selector inheritance

            I think maybe if first items are themselves funcystyles?

            I think if any of the items are themselves funcystyles, then they get inherited

            errorCss = funcyStyle( '.error', { border:'1px #f00' } );
            funcyStyle( '.error', errorCss, { borderWidth_px: 3 } )


        I think maybe should allow a plain raw string????? maybe????

            how to do ????:

                @media (max-width: 600px) {
                  .facet_sidebar {
                    display: none;
                  }
                }


    */
    recursive = 0; // if non-zero then calling recursively from within _fs_render_

    function funcyStyle(selector,args)
    {
        var style, prop, argsIdx, nestIdx, propsIdx, propsObj, arg, properties, propsarray, val, inherProp, nestedFS;

        // based on inherited and properties, build a big object of the properties for this css selector
        properties = { _nested:[] };

        // for all other arguments, get the properties directly
        for ( argsIdx = 1; argsIdx < arguments.length; argsIdx++ )
        {
            propsarray = arguments[argsIdx];
            if ( !is_array(propsarray) )
            {
                propsarray = [ propsarray ];
            }
            for ( propsIdx = 0; propsIdx < propsarray.length; propsIdx++ )
            {
                propsObj = propsarray[propsIdx];
                if ( propsObj != null )  // ignore null or undefined - ignore-this-jslint-error
                {
                    if ( '_fs_selector' in propsObj )
                    {
                        // this is itself a funcyStyle, so inherit all the properties of that style
                        /*jslint forin:true */
                        for ( inherProp in propsObj )
                        {
                            properties[inherProp] = propsObj.properties[inherProp];
                        }
                        /*jslint forin:false */
                    }
                    else
                    {
                        // copy all properties of this object
                        /*jslint forin:true */
                        for ( prop in propsObj )
                        {
                            val = propsObj[prop];
                            if ( val != null ) // ignore null or undefined - ignore-this-jslint-error
                            {
                                if ( isPlainObj(val) )
                                {
                                    // this is a nested funcyStyle
                                    properties._nested.push( [ prop, val ] );
                                }
                                else
                                {
                                    properties[prop] = val;
                                }
                            }
                        }
                        /*jslint forin:false */
                    }
                }
            }
        }

        // finally, save (and possibly overwrite) "_fs_selector" for these properties
        properties._fs_selector = selector;

        properties._fs_render_ = function(nested_parent_selector) {
            var selector, cssText, prop, idx, jdx, value, units,
                first_, nextSelector;

            // start style and add all properties, including decoding of camel stuff
            selector = ( nested_parent_selector ? (nested_parent_selector + ' ') : '' ) + properties._fs_selector;
            cssText = selector + ' {\r\n';
            /*jslint forin:true */
            for ( prop in this )
            {
                first_ = prop.indexOf('_'); // skip properties that start with underscore
                if ( first_ !== 0 )
                {
                    value = this[prop];

                    // sometimes there is a unit as part of the prop name
                    if ( -1 === first_ )
                    {
                        units = '';
                    }
                    else
                    {
                        jdx = prop.lastIndexOf('_');
                        units = prop.substring(jdx+1);
                        prop = prop.substring(0,jdx);
                        if ( units === 'pct') // because cannot have % be part of a name
                        {
                            units = '%';
                        }
                    }

                    if ( is_array(value) )
                    {
                        // do not count any null or undefined values, so remove those from the array
                        for ( jdx = 0; jdx < value.length; jdx++ )
                        {
                            if ( value[jdx] == null )   // ignore-this-jslint-error
                            {
                                value.splice(jdx,1);
                                jdx--;
                            }
                        }
                        if ( value.length === 0 )
                        {
                            // no values in the array, so don't output this property
                            continue;
                        }
                        // if value is an array, turn it into a space-delimited string
                        value = value.join(units + ' ');
                    }
                    value += units;

                    cssText += '  ' + camel_to_dash(prop) + ': ' + value + ';\r\n';
                }
            } /* for ( prop in this ) */
            /*jslint forin:false */

            cssText += '}';

            // put the _nested stuff here
            recursive++;
            for ( idx = 0; idx < this._nested.length; idx++ )
            {
                prop = this._nested[idx][0];
                val = this._nested[idx][1];
                if ( prop.lastIndexOf('&',0) === 0 )
                {
                    nextSelector = prop.substring(1);
                }
                else
                {
                    nextSelector = ' ' + prop;
                }
                nestedFS = funcyStyle(selector+nextSelector,val);
                cssText += '\r\n' + nestedFS._fs_render_(null);
            }
            recursive--;

            return cssText;

        }; /* properties._fs_render_ = function() */

        if ( recursive === 0 )
        {
            try
            {
                window.funcyTag._styles_not_injected.push(properties);
            } catch( e3 ) { /* if funcyTag doesn't exist, that's OK */ }
        }

        return properties;
    } /* function funcyStyle() */

    /*************** initialize ***************/

    window.funcyStyle = funcyStyle;

    /*************** helper functions ***************/

    funcyStyle.color = color;

    funcyStyle.getText = function(fs)
    {
        return fs._fs_render_(null);
    };

    funcyStyle.injectStyle = function(fs_or_string)
    {
        var cssText, sElem, id = null, not_injected_idx;
        try {
            cssText = fs_or_string._fs_render_(null);
            // make up an id for this, if it looks standard, so we can remove old one if it's already there
            id = '-fs-' + fs_or_string._fs_selector;
            sElem = document.getElementById(id);
            if ( sElem )
            {
                sElem.parentNode.removeChild(sElem);
            }

            // if this style is in the funcytTags styles_not_inject list, then remove it from that list now
            try {
                not_injected_idx = window.funcyTag._styles_not_injected.indexOf(fs_or_string);
                window.funcyTag._styles_not_injected.splice(not_injected_idx,1);
            } catch(e7) { /* if no funcyTag then that's OK */ }

        } catch(e) {
            cssText = String(fs_or_string);
        }

        if ( DEBUG )
        {
            try { console.log("INJECT CSS:\r\n" + cssText); } catch(e4) { }
        }

        // from http://stackoverflow.com/questions/3922139/add-css-to-head-with-javascript
        sElem = document.createElement('style');
        sElem.setAttribute('type', 'text/css');
        if ( id !== null )
        {
            sElem.setAttribute('id', id);
        }
        if (sElem.styleSheet) {   // IE
            sElem.styleSheet.cssText = cssText;
        } else {                // the world
            sElem.appendChild(document.createTextNode(cssText));
        }
        document.getElementsByTagName('head')[0].appendChild(sElem);
    };
}(window));
