# FuncyTag version 0.0.3 - see more at https://github.com/BrentNoorda/FuncyTag

import re

gCamelToDashRegexp = re.compile('([A-Z])')

def camel_to_dash(camel):
    # turn upper characters to -c, for example, "cssBackgroundColor" becomes "css-background-color"
    return re.sub(gCamelToDashRegexp,lambda m:u'-'+m.group(1).lower(),camel)

class funcyTag(object):

    def __init__(self,name_or_funcytag,default_attributes=None):

        try:
            # if name_or_functytag is itself another funcytag, then inherit default attributes from that one
            self._ft_name = name_or_funcytag._ft_name
            if name_or_funcytag.default_attributes is not None:
                if default_attributes is None:
                    default_attributes = { }
                default_attributes = dict( name_or_funcytag.default_attributes.items() + default_attributes.items() )
        except:
            self._ft_name = name_or_funcytag

        self.default_attributes = default_attributes

    class _tag(object):

        def __init__(self,name,insides,attributes):

            self._ft_name = name
            self._insides = insides
            self._attributes = attributes

        def _ft_render_(self,stringPadding):

            # start tag and add all attributes, including decoding of styles
            style = u''
            html = u'<' + self._ft_name
            for attr,value in self._attributes.items():
                if value is not None:
                    first_ = attr.find('_') # skip attributes that start with underscore
                    if first_ != 0:
                        # sometimes there is a unit as part of the attr name
                        if -1 == first_:
                            units = u''
                        else:
                            units_idx = attr.rfind('_')
                            units = attr[units_idx+1:]
                            attr = attr[:units_idx]
                            if units == 'pct': # because cannot have % be part of a name
                                units = u'%'

                        if isinstance(value,list):
                            # do not count any undefined values, so remove those from the array
                            value = [ v for v in value if (v is not None) ]
                            if len(value) == 0:
                                # no values in the array, so don't output this attribute
                                continue
                            # if value is an array, turn it into a space-delimited string
                            value = (units + u' ').join([unicode(v) for v in value])
                        else:
                            value = unicode(value)
                        value += units

                        if attr.startswith('css'):
                            style += camel_to_dash(attr)[4:] + u':' + value + u';'
                        else:
                            html += u' ' + attr + u'="' + value + u'"'

            if not self._attributes.get('_nobrout',False):
                html = stringPadding + html

            if (len(stringPadding) == 0) and (not self._attributes.get('_nobrin',False)):
                stringPadding = u'\r\n'

            if len(style) != 0:
                html += u' style="' + style + u'"'

            innerHTML = u''
            innerPadding = u'' if self._attributes.get('_nobrin',False) else (stringPadding + u'  ')
            skipNextPadding = False
            for inside in self._insides:
                if not isinstance(inside,list):
                    inside = [inside]
                for content in inside:
                    if content is not None:
                        try:
                            innerHTML += content._ft_render_(u'' if skipNextPadding else innerPadding)
                            skipNextPadding = content._attributes.get('_nobrout',False)
                        except:
                            if not skipNextPadding:
                                innerHTML += innerPadding
                            else:
                                skipNextPadding = False
                            innerHTML += unicode(content)

            if (len(innerHTML) == 0) and (not self._attributes.get('_noslfcls',False)):
                html += u'/>'
            else:
                html += u'>' + innerHTML + (u'' if (self._attributes.get('_nobrin',False)) else stringPadding) + u'</' + self._ft_name + u'>'
            return html

        def __unicode__(self):
            return self._ft_render_(u'')

        def __str__(self):
            return self.__unicode__().encode('utf-8')


    def __call__(self,*args):   # first arg may be a dict, otherwise all args are things to include

        has_attr = (0 < len(args)) and (type(args[0]) == dict)
        attributes = args[0] if has_attr else {}

        if self.default_attributes is not None:
            # inherit from default_attributes, overriding them with local attributes
            attributes = dict( self.default_attributes.items() + attributes.items() )

        tagobj = self._tag( self._ft_name, args[1:] if has_attr else args, attributes )

        return tagobj

    @staticmethod
    def esc(s):
        return s.replace('&','&amp;').replace('<','&gt;').replace('>','&gt;').replace('"','&quot;')
