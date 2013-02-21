/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, alert */
/* FuncyTag version 0.0.1 - see more at https://github.com/BrentNoorda/FuncyTag */

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

    function funcyTag(name,default_attributes)
    {
        var tag = function(attributes/*,inside1,inside2...*/) {
            var tagobj, argidx, inside, xprop;
            tagobj = { _name:name, _insides:[], _attributes:attributes };
            if ( default_attributes !== undefined )
            {
                // inherit default attributes, but let attributes override them
                tagobj._attributes = { };
                /*jslint forin:true */
                for ( xprop in default_attributes )
                {
                    tagobj._attributes[xprop] = default_attributes[xprop];
                }
                for ( xprop in attributes )
                {
                    tagobj._attributes[xprop] = attributes[xprop];
                }
                /*jslint forin:false */
            }
            for ( argidx = 1; argidx < arguments.length; argidx++ )
            {
                inside = arguments[argidx];
                tagobj._insides.push(inside);
            }

            tagobj._ft_render_ = function(stringPadding,depth) {
                var html, idx, jdx, content, inside, value, attr, units, units_idx, style, innerHTML, first_, innerPadding;

                // start tag and add all attributes, including decoding of styles
                style='';
                html = stringPadding + '<' + this._name;
                if ( stringPadding.length === 0 )
                {
                    stringPadding = '\r\n';
                }
                /*jslint forin:true */
                for ( attr in this._attributes )
                {
                    first_ = attr.indexOf('_'); // skip attributes that start with underscore
                    if ( first_ !== 0 )
                    {
                        value = this._attributes[attr];
                        // sometimes there is a unit as part of the attr name
                        if ( -1 === first_ )
                        {
                            units = '';
                        }
                        else
                        {
                            units_idx = attr.lastIndexOf('_');
                            units = attr.substring(units_idx+1);
                            attr = attr.substring(0,units_idx);
                            if ( units === 'pct') // because cannot have % be part of a name
                            {
                                units = '%';
                            }
                        }

                        if ( attr.substring(0,3) === 'css' )
                        {
                            style += camel_to_dash(attr).substring(4) + ':' + value + units + ';';
                        }
                        else
                        {
                            html += ' ' + attr + '="' + value + units + '"';
                        }
                    }
                }
                /*jslint forin:false */

                if ( style.length !== 0 )
                {
                    html += ' style="' + style + '"';
                }

                innerHTML = '';
                for ( idx = 0; idx < this._insides.length; idx++ )
                {
                    inside = this._insides[idx];
                    if ( !is_array(inside) ) { inside = [inside]; }
                    innerPadding = stringPadding + '  ';
                    for ( jdx = 0; jdx < inside.length; jdx++ )
                    {
                        content = inside[jdx];
                        if ( content !== undefined )
                        {
                            try {
                                innerHTML += content._ft_render_(innerPadding,depth+1);
                            } catch(e) {
                                innerHTML += innerPadding + content.toString();
                            }
                        }
                    }
                }

                if ( (innerHTML.length === 0) && !(this.attributes._no_slfcls_) )
                {
                    html += '/>';
                }
                else
                {
                    html += '>' + innerHTML + stringPadding + '</' + this._name + '>';
                }
                return html;
            };

            tagobj.toString = function() { return this._ft_render_('',0); };

            return tagobj;
        };
        return tag;
    }

    window.funcyTag = funcyTag;

}(window));
