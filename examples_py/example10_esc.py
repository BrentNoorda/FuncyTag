# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div'); p=funcyTag('p'); input=funcyTag('input'); br=funcyTag('br')
esc = funcyTag.esc

def build_example_html():
    t = div(
          p( "the following math equation has less-than and greater-than signs:",
             esc(' a<b>c')
          ),
          br(),
          'weird characters in value',input({'type':'input','value':esc('"dog" & "pony"')})
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
