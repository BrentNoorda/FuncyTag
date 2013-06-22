/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, console, funcyStyle, alert*/
/* FuncyTag version 0.0.4 - see more at https://github.com/BrentNoorda/FuncyTag */

(function(window) {
    var gCamelToDashRegexp,
        gNextUniqueId, gUniqueLen, gNextIdChar, gInitQueue, gElems,
        gGCTimeout, gRenderTimeout, styles_not_injected,
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
                //alert("arguments.length = " + arguments.length + ' match='+match + ' c='+c+' offset='+offset+' string='+string);
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
        this._rgba_ = rgba;
    }

    // internally we know something is a color if it is an object with a _rgba_ property [r,g,b,a]
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
        return new InternalColor( [r,g,b,a] );
    }

    InternalColor.prototype.mix = function(color2,ratio) { // ratio of color1/result - 0.75 meanst 75% color1
        var ratio2 = 1.0 - ratio;
        return color( Math.round(this._rgba_[0]*ratio+color2._rgba_[0]*ratio2),
                      Math.round(this._rgba_[1]*ratio+color2._rgba_[1]*ratio2),
                      Math.round(this._rgba_[2]*ratio+color2._rgba_[2]*ratio2),
                      Math.round(this._rgba_[3]*ratio+color2._rgba_[3]*ratio2) );
    };
    InternalColor.prototype.add = function(color2) {
        return color( this._rgba_[0]+color2._rgba_[0],this._rgba_[1]+color2._rgba_[1],
                      this._rgba_[2]+color2._rgba_[2],(this._rgba_[3]+color2._rgba_[3])/2 );
    };
    InternalColor.prototype.sub = function(color2) {
        return color( this._rgba_[0]-color2._rgba_[0],this._rgba_[1]-color2._rgba_[1],
                      this._rgba_[2]-color2._rgba_[2],(this._rgba_[3]+color2._rgba_[3])/2 );
    };
    InternalColor.prototype.toString = function() {
        var a = this._rgba_[3];

        function hex(c)
        {
            if ( c < 16 ) { return '0' + c.toString(16); }
            else { return c.toString(16); }
        }

        if ( 1.0 <= a )
        {
            return '#' + hex(this._rgba_[0]) + hex(this._rgba_[1]) + hex(this._rgba_[2]);
        }
        else
        {
            return 'rgba(' + this._rgba_.join(',') + ')';
        }
    };
    InternalColor.prototype.r = function(setClr) {
        if ( arguments.length )
        {
            return color(setClr,this._rgba_[1],this._rgba_[2],this._rgba_[3]);
        }
        return this._rgba_[0];
    };
    InternalColor.prototype.g = function(setClr) {
        if ( arguments.length )
        {
            return color(this._rgba_[0],setClr,this._rgba_[2],this._rgba_[3]);
        }
        return this._rgba_[1];
    };
    InternalColor.prototype.b = function(setClr) {
        if ( arguments.length )
        {
            return color(this._rgba_[0],this._rgba_[1],setClr,this._rgba_[3]);
        }
        return this._rgba_[2];
    };
    InternalColor.prototype.a = function(setClr) {
        if ( arguments.length )
        {
            return color(this._rgba_[0],this._rgba_[1],this._rgba_[2],setClr);
        }
        return this._rgba_[3];
    };
    /*************** tool to create a unique ID, forever, if one is not supplied, for global event trackers ***************/

    gNextUniqueId = "";  // each time an id isn't supplied, and we need one, supply it here
    gUniqueLen = 0;
    gNextIdChar = 'a'; // will roll among all the characters of the alphabet

    function get_next_unique_id() {
        var ret = gNextUniqueId + gNextIdChar + '-ft-unq';

        function increment_root_string(len)
        {
            var ret = true, endChar;
            if ( len === 0 )
            {
                ret = false;
            }
            else
            {
                endChar = gNextUniqueId.charAt(len-1);
                if ( endChar === 'z' )
                {
                    endChar = 'a';
                    ret = increment_root_string(len-1);
                }
                else
                {
                    endChar = String.fromCharCode(endChar.charCodeAt(0)+1);
                }
                gNextUniqueId = gNextUniqueId.substring(0,len-1) + endChar;
            }
            return ret;
        }

        if ( gNextIdChar === 'z' )
        {
            // increment the root string
            if ( !increment_root_string(gUniqueLen) )
            {
                gUniqueLen++;
                gNextUniqueId += 'a';
            }
            gNextIdChar = 'a';
        }
        else
        {
            gNextIdChar = String.fromCharCode(gNextIdChar.charCodeAt(0)+1);
        }
        return ret;
    }

    /*************** global event/attribute trackers ***************/
    gInitQueue = { }; // elements waiting to initialize (via oninit), indexed by element id
    gElems = { }; // all elements we keep attributes about (indexed by id)
    gRenderTimeout = null;
    gGCTimeout = null; // timeout for when we're removing unused elements

    function next_oninit()
    {
        var id, elem, attributes, funcname, func, evHandler;
        gRenderTimeout = null;

        function event_handler_fn(attrs,func)
        {
            return function(e) {
                func.call(attrs,document.getElementById(attrs.id),e || window.event);
            };
        }

        /*jslint forin:true */
        for ( id in gInitQueue )
        {
            elem = document.getElementById(id);
            if ( elem !== null )
            {
                attributes = gElems[id] = gInitQueue[id];
                delete gInitQueue[id];

                // add event listeners for all the funcs (except oninit and onterm)
                for ( funcname in attributes )
                {
                    if ( funcname.lastIndexOf('on',0) === 0 )
                    {
                        if ( (funcname !== 'oninit') && (funcname !== 'onterm') )
                        {
                            func = attributes[funcname];

                            if (elem.addEventListener)
                            {
                                elem.addEventListener(funcname.substring(2), event_handler_fn(attributes,func), false);
                            }
                            else
                            {
                                elem.attachEvent(funcname, event_handler_fn(attributes,func));
                            }
                        }
                    }
                }

                if ( 'oninit' in attributes )
                {
                    attributes.oninit.call(attributes,elem);
                }
            }
        }
        /*jslint forin:false */

        // if there is still stuff to render, then call again real soon
        if ( gRenderTimeout === null )
        {
            /*jslint forin:true */
            for ( id in gInitQueue )
            {
                if ( DEBUG )
                {
                    try { console.log("RERENDER because something not ready yet"); } catch(e5) { }
                }
                gRenderTimeout = setTimeout(next_oninit,0);
            }
            /*jslint forin:false */
        }
    }

    function remove_elem(id,bodyunload)
    {
        var attrs = gElems[id];
        delete gElems[id];
        if ( 'onterm' in attrs )
        {
            attrs.onterm.call(attrs,bodyunload);
        }
    }

    function elem_GC()
    {
        var id, elem;

        gGCTimeout = null;

        /*jslint forin:true */
        for ( id in gElems )
        {
            elem = document.getElementById(id);
            if ( elem === null )
            {
                remove_elem(id,false);
            }
        }
        /*jslint forin:false */

        gGCTimeout = setTimeout(elem_GC,1000);
    }
    setTimeout(elem_GC,1000);

    function _attach_window_unload()
    {
        function unload()
        {
            var id;
            if ( gRenderTimeout !== null )
            {
                clearTimeout(gRenderTimeout);
                gRenderTimeout = null;
            }
            if ( gGCTimeout !== null )
            {
                clearTimeout(gGCTimeout);
                gGCTimeout = null;
            }

            /*jslint forin:true */
            for ( id in gElems )
            {
                remove_elem(id,true);
            }
            /*jslint forin:false */
        }

        if (window.addEventListener) { window.addEventListener('unload', unload, false); }
	    else { window.attachEvent("onunload", unload); }
    }
    _attach_window_unload();

    /*************** interact with funcystyles which will list here styles not injected yet ***************/

    styles_not_injected = [ ];  // this is the only place where funcyCss communicated with funcyStyle
                                // and if this doesn't exist funcyCss will be OK with it

    function inject_all_remaining_styles()
    {
        var fs, cssText = '';
        while ( styles_not_injected.length !== 0 )
        {
            fs = styles_not_injected.shift();
            if ( cssText.length !== 0 )
            {
                cssText += '\r\n';
            }
            cssText += funcyStyle.getText(fs);
        }
        if ( cssText.length !== 0 )
        {
            funcyStyle.injectStyle(cssText);
        }
    }

    //function inject_all_remaining_styles()
    //{
    //    while ( styles_not_injected.length !== 0 )
    //    {
    //        funcyStyle.injectStyle( styles_not_injected.shift() );
    //    }
    //}


    /*************** build tag ***************/

    function funcyTag(name_or_funcytag,default_attributes)
    {
        var name, tag, prop;

        try
        {
            if ( '_ft_name' in name_or_funcytag )
            {
                // if name_or_functytag is itself another funcytag, then inherit default attributes from that one
                name = name_or_funcytag._ft_name;
                if ( name_or_funcytag.default_attributes !== undefined )
                {
                    default_attributes = default_attributes || { };
                    default_attributes._superAttr = name_or_funcytag.default_attributes;
                    /*jslint forin:true */
                    for ( prop in name_or_funcytag.default_attributes )
                    {
                        if ( !(prop in default_attributes) )
                        {
                            default_attributes[prop] = name_or_funcytag.default_attributes[prop];
                        }
                    }
                    /*jslint forin:false */
                }
            }
        } catch(e) {
            name = name_or_funcytag;
        }

        /*************** tag instance ***************/

        tag = function(attributes/*,inside1,inside2...*/) {
            var tagobj, argidx, inside, xprop, has_own_attr;
            has_own_attr = isPlainObj(attributes);
            tagobj = { _ft_name:name, _insides:[], _attributes: has_own_attr ? attributes :  {} };

            if ( default_attributes !== undefined )
            {
                // inherit default attributes, but let attributes override them
                tagobj._attributes = { _superAttr:default_attributes };
                /*jslint forin:true */
                for ( xprop in default_attributes )
                {
                    tagobj._attributes[xprop] = default_attributes[xprop];
                }
                if ( has_own_attr )
                {
                    for ( xprop in attributes )
                    {
                        tagobj._attributes[xprop] = attributes[xprop];
                    }
                }
                /*jslint forin:false */
            }
            for ( argidx = has_own_attr ? 1 : 0; argidx < arguments.length; argidx++ )
            {
                inside = arguments[argidx];
                tagobj._insides.push(inside);
            }

            tagobj._ft_render_ = function(stringPadding) {
                var html, idx, jdx, content, inside, value, attr, units, style, innerHTML, first_, innerPadding, skipNextPadding,
                    hasFuncs = false, id = null;

                // if there is any css styles to be put into the page, put them in now
                inject_all_remaining_styles();

                // start tag and add all attributes, including decoding of properties
                style = '';
                html = '<' + this._ft_name;
                /*jslint forin:true */
                for ( attr in this._attributes )
                {
                    first_ = attr.indexOf('_'); // skip attributes that start with underscore
                    if ( first_ !== 0 )
                    {
                        value = this._attributes[attr];
                        if ( value !== undefined )  // if decodes as undefined then don't add this attribute
                        {
                            // sometimes there is a unit as part of the attr name
                            if ( -1 === first_ )
                            {
                                units = '';
                            }
                            else
                            {
                                jdx = attr.lastIndexOf('_');
                                units = attr.substring(jdx+1);
                                attr = attr.substring(0,jdx);
                                if ( units === 'pct') // because cannot have % be part of a name
                                {
                                    units = '%';
                                }
                            }

                            if ( attr.lastIndexOf('on',0) === 0 )
                            {
                                // adding an on--- function
                                hasFuncs = true;
                            }
                            else
                            {
                                if ( is_array(value) )
                                {
                                    // do not count any undefined values, so remove those from the array
                                    for ( jdx = 0; jdx < value.length; jdx++ )
                                    {
                                        if ( value[jdx] === undefined )
                                        {
                                            value.splice(jdx,1);
                                            jdx--;
                                        }
                                    }
                                    if ( value.length === 0 )
                                    {
                                        // no values in the array, so don't output this attribute
                                        continue;
                                    }
                                    // if value is an array, turn it into a space-delimited string
                                    value = value.join(units + ' ');
                                }
                                value += units;

                                if ( attr.lastIndexOf('css',0) === 0 )
                                {
                                    style += camel_to_dash(attr).substring(4) + ':' + value + ';';
                                }
                                else
                                {
                                    html += ' ' + attr + '="' + value + '"';
                                    if ( attr === 'id' )
                                    {
                                        id = value;
                                    }
                                }
                            }
                        }
                    }
                }
                /*jslint forin:false */

                if ( !this._attributes._nobrout )
                {
                    html = stringPadding + html;
                }

                if ( (stringPadding.length === 0) && !this._attributes._nobrin )
                {
                    stringPadding = '\r\n';
                }

                if ( style.length !== 0 )
                {
                    html += ' style="' + style + '"';
                }

                // for later callbacks, we may now need onfunctions, and data, and a unique id
                if ( hasFuncs )
                {
                    // need to have a unique id for this element, so create one if not there already
                    if ( id === null )
                    {
                        id = get_next_unique_id();
                        this._attributes.id = id;
                        html += ' id="' + id + '"';
                    }
                    if ( DEBUG )
                    {
                        if ( id in gInitQueue )
                        {
                            alert('FuncyTags adding id "' + id + '" when previous "' + id + '" has not initialized yet.');
                        }
                    }
                    if ( id in gElems )
                    {
                        // id being reused, so remove existing instance of it
                        remove_elem(id,false);
                    }
                    gInitQueue[id] = this._attributes;
                    if ( gRenderTimeout === null )
                    {
                        gRenderTimeout = setTimeout(next_oninit,0);
                    }
                }

                innerHTML = '';
                innerPadding = this._attributes._nobrin ? '' : (stringPadding + '  ');
                skipNextPadding = false;
                for ( idx = 0; idx < this._insides.length; idx++ )
                {
                    inside = this._insides[idx];
                    if ( !is_array(inside) ) { inside = [inside]; }
                    for ( jdx = 0; jdx < inside.length; jdx++ )
                    {
                        content = inside[jdx];
                        if ( content !== undefined )
                        {
                            try {
                                innerHTML += content._ft_render_(skipNextPadding?'':innerPadding);
                                skipNextPadding = content._attributes._nobrout;
                            } catch(e) {
                                if ( !skipNextPadding )
                                {
                                    innerHTML += innerPadding;
                                }
                                else
                                {
                                    skipNextPadding = false;
                                }
                                innerHTML += String(content);
                            }
                        }
                    }
                }

                if ( (innerHTML.length === 0) && !(this._attributes._noslfcls) )
                {
                    html += '/>';
                }
                else
                {
                    html += '>' + innerHTML + ((this._attributes._nobrin) ? '' : stringPadding) + '</' + this._ft_name + '>';
                }

                return html;
            }; /* tagobj._ft_render_ = function() */

            tagobj.toString = function() { return this._ft_render_(''); };

            tagobj.createElement = function() { return funcyTag.createElement(this); };

            return tagobj;
        }; /* tag = function() { */
        tag._ft_name = name;
        tag.default_attributes = default_attributes;
        return tag;
    } /* function funcyTag() */

    /*************** initialize ***************/

    window.funcyTag = funcyTag;

    /*************** helper functions ***************/

    funcyTag._styles_not_injected = styles_not_injected; // so funcyStyle.js can find it

    funcyTag.color = color;

    funcyTag.esc = function( str )
    {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    funcyTag.createElement = function(ft)
    // turn element into a dom (or at least the first child of the element)
    {
        var div = document.createElement('div');
        div.innerHTML = ft.toString();
        return div.firstChild;
    };

    funcyTag.debugTrackers = function()
    {
        var id, count, ret = "FuncyTag debug trackers";

        ret += "\r\n\r\ngInitQueue items:\r\n";
        count = 0;
        /*jslint forin:true */
        for ( id in gInitQueue )
        {
            count++;
            ret += " " + id + "\r\n";
        }
        /*jslint forin:false */
        ret += "Total gInitQueue items: " + count + '\r\n';

        ret += "\r\n\r\ngElems items:\r\n";
        count = 0;
        /*jslint forin:true */
        for ( id in gElems )
        {
            count++;
            ret += " " + id + "\r\n";
        }
        /*jslint forin:false */
        ret += "Total gElems items: " + count + '\r\n';

        return ret;
    };
}(window));
