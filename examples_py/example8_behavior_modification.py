# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div'); ul=funcyTag('ul'); li=funcyTag('li',{'_nobrin':True})
span = funcyTag('span',{'_nobrout':True,'_nobrin':True})
good_li = funcyTag( 'li', {'_nobrin':True,'cssColor':'green'} )
bad_li = funcyTag( 'li', {'_nobrin':True,'cssColor':'red'} )
green = funcyTag( 'span', {'_nobrout':True,'_nobrin':True,'cssColor':'green'} )
red = funcyTag( 'span', {'_nobrout':True,'_nobrin':True,'cssColor':'red'} )
big = funcyTag( 'span', {'_nobrout':True,'_nobrin':True,'cssFontSize_pct':150} )

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
          ),
          div({'id':'noop-div','_noslfcls':True,'_nobrin':True})
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
