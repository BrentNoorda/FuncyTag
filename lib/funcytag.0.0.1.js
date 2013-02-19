/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window */
/* FuncyTag version 0.0.1 - see more at https://github.com/BrentNoorda/FuncyTag */

(function(window) {

    var gToStringPadding = '',
        gCamelToDashRegexp = new RegExp('([A-Z])','g');

    function camel_to_dash(camel)
    // turn upper characters to -c, for example, "cssBackgroundColor" becomes "css-background-color"
    {
        return camel.replace(gCamelToDashRegexp,function(match,c,offset,string){
                //alert("arguments.length = " + arguments.length + ' match='+match + ' c='+c+' offset='+offset+' string='+string);
                return '-' + c.toLowerCase();
            });
    }

    function funcyTag(name)
    {
        var tag = function(attributes/*,inside1,inside2...*/) {
            var tagobj, argidx, inside;
            tagobj = { _name:name, _insides:[], _attributes:attributes };
            for ( argidx = 1; argidx < arguments.length; argidx++ )
            {
                inside = arguments[argidx];
                tagobj._insides.push(inside);
            }

            tagobj.toString = function() {
                var html, idx, inside, savePadding, attr, style, innerHTML;

                // start tag and add all attributes, including decoding of styles
                style='';
                html = '<' + this._name;
                for ( attr in this._attributes )
                {
                    if ( attr.substring(0,3) === 'css' )
                    {
                        style += camel_to_dash(attr).substring(4) + ':' + this._attributes[attr] + ';';
                    }
                    else
                    {
                        html += ' ' + attr + '="' + this._attributes[attr] + '"';
                    }
                }

                if ( style.length !== 0 )
                {
                    html += ' style="' + style + '"';
                }

                innerHTML = '';
                savePadding = gToStringPadding;
                gToStringPadding += '  ';
                for ( idx = 0; idx < this._insides.length; idx++ )
                {
                    inside = this._insides[idx];
                    innerHTML += gToStringPadding + inside.toString() + '\r\n';
                }
                gToStringPadding = savePadding;

                if ( innerHTML.length === 0 )
                {
                    html += '/>';
                }
                else
                {
                    html += '>\r\n' + innerHTML + gToStringPadding + '</' + this._name + '>';
                }
                return html;
            };

            return tagobj;
        };
        return tag;
    }

    window.funcyTag = funcyTag;

}(window));