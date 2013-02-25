# example1_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

div=funcyTag('div'); p=funcyTag('P')

def count_to_ten():
    ret = []
    for i in range(0,11):
        ret.append(i)
    return ret

def build_example_html():
    t = div({},
          p({},'regular paragraph 1'),
          [ p({},'Paragraph 1 in array'), None, p({},'Paragraph 2 in array'), p({},'Paragraph 3 in array') ],
          p({},'regular paragraph 2'),
          [ ],  # empty array results in nothing
          p({},'regular paragraph 3'),
          count_to_ten(),
          p({},'regular paragraph 4')
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
