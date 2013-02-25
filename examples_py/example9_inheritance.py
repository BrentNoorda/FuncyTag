# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div'); ul=funcyTag('ul'); li=funcyTag('li',{'_nobrin':True})
span=funcyTag('span',{'_nobrout':True,'_nobrin':True})

good_li = funcyTag( li, {'cssColor':'green'} )
bad_li = funcyTag( li, {'cssColor':'red'} )
green = funcyTag( span, {'cssColor':'green'} )
red = funcyTag( span, {'cssColor':'red'} )
big = funcyTag( span, {'cssFontSize_pct':150} )

def build_example_html():
    t = div(
          'foods: ' + str(green(big('L'),'ike')) + ', ',
          red(big('H'),'ate'), ',', 'or ',big('I'),'ndifferent',
          ul(
            li('rice'),
            bad_li('okra'),
            good_li('pizza'),
            good_li('ice cream'),
            bad_li({'cssFontStyle':'italic'},'dog poop'),
            li('chicken')
          )
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
