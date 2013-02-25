# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div')

def build_example_html():
    t = div( dict( id='outer', cssFontSize_px=20, cssColor='red' ),
          'begin outer div',
          div( dict( id='middle', cssFontSize_px=16, cssColor='green', cssMarginLeft_em=2 ),
            'begin middle div',
            div( dict( id='inner', cssFontSize_px=12, cssColor='blue', cssMarginLeft_em=2 ),
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
