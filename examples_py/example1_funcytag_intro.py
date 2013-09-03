# example1_funcytag_intro - demonstrate very basic use of Tags as Functions
#
# FuncyTag replaces html with a python-like syntax

import os, sys; sys.path.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'..')

from lib.funcytag import funcyTag

p=funcyTag('P')

def build_example_html():
    t = p( { 'id':'outty', 'style':'font-size:200%;color:red;' },
           "I'm a little teacup, short and stout."
        )
    return unicode(t)

if __name__ == "__main__":
    print
    print build_example_html()
    print
