# example3_css_styles - fold css styles into the cssCamelCase attributes. e.g.
#                       styles:"margin-left:2em;" becomes cssMarginLeft:"2em"

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div')

def build_example_html():
    t = div( { 'id':'outer', 'cssFontSize':'20px', 'cssColor':'red', 'cssMarginLeft':None },
          'begin outer div',
          div( { 'id':'middle', 'cssFontSize':'16px', 'cssColor':'green', 'cssMarginLeft':'12px' },
            'begin middle div',
            div( { 'id':'inner', 'cssFontSize':'12px', 'cssColor':'blue', 'cssMarginLeft':'12px' },
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
