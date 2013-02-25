# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div')

def build_example_html():
    t = div( dict( id='outer', style='font-size:20px;color:red;' ),
          'begin outer div',
          div( dict( id='middle', style='font-size:16px;color:green;margin-left:12px;' ),
            'begin middle div',
            div( dict( id='inner', style='font-size:12px;color:blue;margin-left:12px;' ),
              'center div'
            ),
            'end middle div'
          ),
          'end outer div'
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
