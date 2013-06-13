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
    window.gSaveFS1 =  // this line just so our "show FuncyStyle css string output" will work for tutorial
    funcyStyle( '.box',
                { backgroundColor: boxBG,
                  padding_px: boxPadding } );
    window.gSaveFS2 =  // this line just so our "show FuncyStyle css string output" will work for tutorial
    funcyStyle( '#mytext',
                { backgroundColor: boxFG,
                  color: boxBG,
                  margin: 0,
                  padding_px: boxPadding / 2 } );
}

window.onload = function() {
    build_example_css();
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};