/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, funcyStyle*/

var boxBG = 'red';
var boxFG = 'green';
var boxPadding = 16;

var div=funcyTag('div'), p=funcyTag('p'), h1=funcyTag('h1'), a=funcyTag('a');

function build_example_html()
{
    var t;
    t = div( { id:'header' },
             h1( 'Hello, squirrel.' ),
             p( 'Are you a',
                a( { href:'http://en.wikipedia.org/wiki/Nut_(fruit)', target:'_blank' },
                   'nut?') )
        );
    return String(t);
}

function build_example_css() {
    window.gSaveFS =  // for "show FuncyStyle css string output"
    funcyStyle( '#header', {
                  textAlign: 'center',
                  h1: { fontSize_px: 20,
                      fontWeight: 'bold'
                  },
                  p: { fontSize_px: 16,
                       a: { color: 'red', textDecoration: 'none',
                         '&:hover': { backgroundColor:'green' }
                       }
                  }
                }
              );
}

window.onload = function() {
    build_example_css();
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};