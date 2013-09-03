# example7_default_attributes - create new tags with default attributes (such as <good_li> and <bad_li>)

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div'); ul=funcyTag('ul'); li=funcyTag('li'); span=funcyTag('span')

# create a good_li tag that is a green <li>, and bad_li tag that is red
good_li = funcyTag( 'li', {'cssColor':'green'} )
bad_li = funcyTag( 'li', {'cssColor':'red'} )

def build_example_html():
    t = div({},
          'foods: ', span({'cssColor':'green'},'like,'), span({'cssColor':'red'},'hate,'), 'or indifferent',
          ul({},
            li({},'rice'),
            bad_li({},'okra'),
            good_li({},'pizza'),
            good_li({},'ice cream'),
            bad_li({},'dog poop'),
            li({},'chicken')
          )
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
