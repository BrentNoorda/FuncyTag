# example10_esc - escaping text strings - using funcyTag.esc() for strings that may contain html characters

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
