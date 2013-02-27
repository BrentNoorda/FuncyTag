/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window */
/* FuncyTag version 0.0.3 - see more at https://github.com/BrentNoorda/FuncyTag */

(function(window) {

    var gCamelToDashRegexp = new RegExp('([A-Z])','g');

    function camel_to_dash(camel)
    // turn upper characters to -c, for example, "cssBackgroundColor" becomes "css-background-color"
    {
        return camel.replace(gCamelToDashRegexp,function(match,c,offset,string){
                //alert("arguments.length = " + arguments.length + ' match='+match + ' c='+c+' offset='+offset+' string='+string);
                return '-' + c.toLowerCase();
            });
    }

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
                var html, idx, jdx, content, inside, value, attr, units, style, innerHTML, first_, innerPadding, skipNextPadding;

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

    window.funcyTag = funcyTag;

    window.funcyTag.esc = function( str )
    {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

}(window));
