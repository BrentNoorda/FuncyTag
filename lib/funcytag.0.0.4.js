/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, console, alert */
/* FuncyTag version 0.0.4 - see more at https://github.com/BrentNoorda/FuncyTag */

// new stuff
// _superAttr = null if no supertag
// are we correctly handling it when _superAttr things within an array, for instances if it has classes to meld in? and events

//can we add a help function funcyTag.find(id) to return the elem and its attributes? even creating object if we must? maybe? but how if it
// doesn't go into xElem? _findable? if has data?
// explain createElement
// explain funcyStyle


(function(window) {
    var gCamelToDashRegexp, gNextUniqueId, gUniqueLen, gNextIdChar, gInitQueue, gElems,
        gGCTimeout, gRenderTimeout, DEBUG = true;

    /*************** build tag ***************/

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

    /*************** tool to create a unique ID, forever, if one is not suppliedglobal event trackers ***************/

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
                    console.log("RERENDER because something not ready yet");
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
            };

            tagobj.toString = function() { return this._ft_render_(''); };

            tagobj.createElement = function() { return funcyTag.createElement(this); };

            return tagobj;
        };
        tag._ft_name = name;
        tag.default_attributes = default_attributes;
        return tag;
    }

    /*************** build style ***************/

    /*
        many ways to use this tag

        variables

            no brainer (that's what scripting language does best)

        nesting

            funcyStyle('table.h1',{ margin_em:[2 0], 'td.ln': funcyStyle('td.ln',{textAlign:'right'}} })

        mixins

            handled by calling functions that return array (or object) of attributes

        selector inheritance

            I think maybe if first items are themselves funcytags?

            errorCss = funcyStyle( '.error', { border:'1px #f00' } );
            funcyStyle( '.error', errorCss, { borderWidth_px: 3 } )

    */

    function funcyStyle(selector,name_or_funcytag,default_attributes)
    {
        var tag;
/*
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
*/
                    /*jslint forin:true */
/*
                    for ( prop in name_or_funcytag.default_attributes )
                    {
                        if ( !(prop in default_attributes) )
                        {
                            default_attributes[prop] = name_or_funcytag.default_attributes[prop];
                        }
                    }
*/
                    /*jslint forin:false */
/*
                }
            }
        } catch(e) {
            name = name_or_funcytag;
        }
*/
        /*************** tag instance ***************/

        tag = function(attributes/*,inside1,inside2...*/) {
/*
            var tagobj, argidx, inside, xprop, has_own_attr;
            has_own_attr = isPlainObj(attributes);
            tagobj = { _ft_name:name, _insides:[], _attributes: has_own_attr ? attributes :  {} };

            if ( default_attributes !== undefined )
            {
                // inherit default attributes, but let attributes override them
                tagobj._attributes = { _superAttr:default_attributes };
*/
                /*jslint forin:true */
/*
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
*/
                /*jslint forin:false */
/*
            }
            for ( argidx = has_own_attr ? 1 : 0; argidx < arguments.length; argidx++ )
            {
                inside = arguments[argidx];
                tagobj._insides.push(inside);
            }

            tagobj._ft_render_ = function(stringPadding) {
                var html, idx, jdx, content, inside, value, attr, units, style, innerHTML, first_, innerPadding, skipNextPadding,
                    hasFuncs = false, id = null;

                // start tag and add all attributes, including decoding of properties
                style = '';
                html = '<' + this._ft_name;
*/
                /*jslint forin:true */
/*
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
*/
                /*jslint forin:false */
/*

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
            };

            tagobj.toString = function() { return this._ft_render_(''); };

            tagobj.createElement = function() { return funcyTag.createElement(this); }

            return tagobj;
*/
        };
/*
        tag._ft_name = name;
        tag.default_attributes = default_attributes;
        return tag;
*/
    }

    /*************** initialize ***************/

    window.funcyTag = funcyTag;
    window.funcyStyle = funcyStyle;

    /*************** helper functions ***************/

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

    funcyStyle.testTheory = function() // from http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
    // from http://stackoverflow.com/questions/3922139/add-css-to-head-with-javascript
    {
        var css, s;

        css = '.goober {\r\nfont-size:10%; color:green;\r\n}';

        s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(s);
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
        ret += "Total gInitQueue items: " + count + '\r\n';

        ret += "\r\n\r\ngElems items:\r\n";
        count = 0;
        for ( id in gElems )
        {
            count++;
            ret += " " + id + "\r\n";
        }
        ret += "Total gElems items: " + count + '\r\n';
        /*jslint forin:false */

        return ret;
    };

}(window));
