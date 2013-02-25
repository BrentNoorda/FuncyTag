# example5_inner_tag - contents of a tag may include another tag, here demonstrated by a recursive tag maker

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div')

def build_example_html():
    def inner_tag(height): # embed inner tags until height reaches 0
        return div( dict( cssFontSize_px=height, cssMarginLeft_px=2.5*height ),
                 'begin height %d' % height,
                 inner_tag(height-1) if (height > 1) else None,
                 'end height %d' % height
               )
    return unicode( inner_tag(20) )

if __name__ == "__main__":
    print
    print build_example_html()
    print
