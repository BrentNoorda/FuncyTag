/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, console, alert */
/* FuncyTag version 0.0.4 - see more at https://github.com/BrentNoorda/FuncyTag */

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

    /*************** global event/data trackers ***************/
    gInitQueue = { }; // elements waiting to initialize (via oninit), indexed by element id
    gElems = { }; // all elements we keep data about (indexed by id)
    gRenderTimeout = null;
    gGCTimeout = null; // timeout for when we're removing unused elements

    function next_oninit()
    {
        var id, elem, data, funcname, func, evHandler;
        gRenderTimeout = null;

        function event_handler_fn(id,data,func)
        {
            return function(e) {
                func(id,data,document.getElementById(id),e || window.event);
            };
        }

        /*jslint forin:true */
        for ( id in gInitQueue )
        {
            elem = document.getElementById(id);
            if ( elem !== null )
            {
                data = gElems[id] = gInitQueue[id];
                delete gInitQueue[id];

                // add event listeners for all the funcs (except oninit and onterm)
                for ( funcname in data._funcs )
                {
                    if ( (funcname !== 'oninit') && (funcname !== 'onterm') )
                    {
                        func = data._funcs[funcname];

                        if (elem.addEventListener)
                        {
                            elem.addEventListener(funcname.substring(2), event_handler_fn(id,data,func), false);
                        }
                        else
                        {
                            elem.attachEvent(funcname, event_handler_fn(id,data,func));
                        }
                    }
                }

                if ( 'oninit' in data._funcs )
                {
                    data._funcs.oninit(id,data,elem);
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
        var data = gElems[id];
        delete gElems[id];
        if ( 'onterm' in data._funcs )
        {
            data._funcs.onterm(id,data,bodyunload);
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
            var tagobj, argidx, inside, xprop, has_attr;
            has_attr = isPlainObj(attributes);
            tagobj = { _ft_name:name, _insides:[], _attributes: has_attr ? attributes :  {} };

            if ( default_attributes !== undefined )
            {
                // inherit default attributes, but let attributes override them
                tagobj._attributes = { };
                /*jslint forin:true */
                for ( xprop in default_attributes )
                {
                    tagobj._attributes[xprop] = default_attributes[xprop];
                }
                if ( has_attr )
                {
                    for ( xprop in attributes )
                    {
                        tagobj._attributes[xprop] = attributes[xprop];
                    }
                }
                /*jslint forin:false */
            }
            for ( argidx = has_attr ? 1 : 0; argidx < arguments.length; argidx++ )
            {
                inside = arguments[argidx];
                tagobj._insides.push(inside);
            }

            tagobj._ft_render_ = function(stringPadding) {
                var html, idx, jdx, content, inside, value, attr, units, style, innerHTML, first_, innerPadding, skipNextPadding,
                    data = null, funcs = { }, hasFuncs = false, id = null;

                // start tag and add all attributes, including decoding of styles
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

                            if ( attr === 'data' )
                            {
                                // adding the data object
                                data = value;
                            }
                            else if ( attr.substring(0,2) === 'on' )
                            {
                                // adding an on--- function
                                funcs[attr] = value;
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

                                if ( attr.substring(0,3) === 'css' )
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
                    if ( data === null )
                    {
                        data = { };
                    }
                }
                if ( data !== null )
                {
                    data._funcs = funcs;
                    // need to have a unique id for this element, so create one if not there already
                    if ( id === null )
                    {
                        id = get_next_unique_id();
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
                    gInitQueue[id] = data;
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

            return tagobj;
        };
        tag._ft_name = name;
        tag.default_attributes = default_attributes;
        return tag;
    }

    /*************** initialize ***************/

    window.funcyTag = funcyTag;

    /*************** the "esc" feature ***************/

    window.funcyTag.esc = function( str )
    {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    window.funcyTag.debugTrackers = function()
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
