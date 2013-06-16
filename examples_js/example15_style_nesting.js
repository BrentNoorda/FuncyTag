/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, funcyStyle*/

var boxBG = 'red';
var boxFG = 'green';
var boxPadding = 16;

var div = funcyTag( 'div' ), p = funcyTag( 'p' );

function build_example_html()
{
    t = div( {class_:'box'},
             p({id:'mytext'},'Hello, squirrels')
        );
    return String(t);
}

function build_example_css() {
    window.gSaveFS =  // for "show FuncyStyle css string output"
    funcyStyle( '#header', {
                  h1: { fontSize_px: 26,
                      fontWeight: 'bold'
                  },
                  p: { fontSize_px: 12,
                     a: { textDecoration: 'none' },
                     'a:hover': { borderWidth_px: 1 }
                  }
                }
              );
}

window.onload = function() {
    build_example_css();
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};