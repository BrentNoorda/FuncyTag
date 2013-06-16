/*jslint white:false plusplus:false browser:true nomen:false */
/*globals window, funcyTag, funcyStyle*/

function no_propagate(evt) {
    if (evt.stopPropagation) {
        evt.stopPropagation();   // W3C model
    } else {
        evt.cancelBubble = true; // IE model
    }
}

var boxSize = 80; // how many pixels tall and wide is each box

var div = funcyTag( 'div', { _noslfcls:true } );
var p = funcyTag( 'p', { cssMargin_px:[5,0,5,0] } );
var action = funcyTag( 'button' );
var box = funcyTag( div,
                    { class_: 'box',
                      oninit: function(elem) {
                        this._render(elem);
                      },
                      onmouseover: function(elem,evt) {
                        elem.style.backgroundColor = 'black';
                        elem.style.color = 'white';
                      },
                      onmouseout: function(elem,evt) {
                        elem.style.backgroundColor = 'white';
                        elem.style.color = 'black';
                      },
                      onclick: function(elem,evt) {
                        this._clicked++;
                        this._render(elem);
                      },
                      _render: function(elem) {
                        elem.innerHTML = p('box ' + this._idx) + p(this._clicked + ' clicks') +
                                         action( { onclick: function(elem,evt) {
                                                     var box = elem.parentNode;
                                                     box.parentNode.removeChild(box);
                                                     no_propagate(evt);
                                                   }
                                                 }, 'remove');
                      } } );
var clear = funcyTag( div, { cssClear:'both' } );

function build_example_html()
{
    var t, highest_idx = 0;

    function lotsa_boxes(count) {
        var i, ret = [];
        for ( i = 0; i < count; i++ ) {
            ret.push( box({ _idx:highest_idx++, _clicked:0 }) );
        }
        return ret;
    }

    t = div(
          lotsa_boxes(11),

          // add a box at the end to offer an add-new-box option
          box( { _render: function(elem) { }, cssLineHeight_px:boxSize },
               action( { onclick: function(elem,evt) {
                           var newbox, newboxElem, myBox, boxesContainer;

                           // create another box as a dom element
                           newbox = lotsa_boxes(1)[0];
                           newboxElem = newbox.createElement();

                           // insert that new box before the current box
                           myBox = elem.parentNode;
                           boxesContainer = myBox.parentNode;
                           boxesContainer.insertBefore(newboxElem,myBox);

                           no_propagate(evt);
                         }
                       }, 'add') ),

          clear()
        );
    return String(t);
}

function build_example_css() {
    window.gSaveFS =  // for "show FuncyStyle css string output"
    funcyStyle( '.box',
                { borderStyle:'solid',
                  width_px:boxSize,
                  height_px:boxSize,
                  textAlign:'center',
                  float:'left',
                  padding_em: 0.3,
                  cursor: 'pointer' } );
}

window.onload = function() {
    build_example_css();
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};