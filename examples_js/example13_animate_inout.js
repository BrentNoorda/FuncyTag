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
var boxAnimateTime = 333; // how long boxes take to animate

var div = funcyTag( 'div', { _noslfcls:true } );
var p = funcyTag( 'p', { cssMargin_px:[5,0,5,0] } );
var action = funcyTag( 'button' );
var box = funcyTag( div,
                    { class_: 'box',
                      oninit: function(elem) {
                        this._render(elem);
                        elem.className += ' fullsize';
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
                                                     box.className = 'box';
                                                     setTimeout(function(){box.parentNode.removeChild(box);},boxAnimateTime);
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

    function multibrowser_transitions(transitions)  // return css properties for many different browsers
    {
        return { '-webkit-transition': transitions,
                    '-moz-transition': transitions,
                     '-ms-transition': transitions,
                      '-o-transition': transitions,
                         'transition': transitions };
    }

    var specs = ' ' + boxAnimateTime + 'ms linear';
    window.gSaveFS1 =  // for "show FuncyStyle css string output"
    funcyStyle( '.box', multibrowser_transitions('height' + specs + ', width' + specs + ', margin' + specs),
                { borderStyle:'solid',
                  width_px:0,
                  height_px:0,
                  marginTop_px: boxSize / 2,
                  marginBottom_px: boxSize / 2,
                  textAlign:'center',
                  float:'left',
                  padding_em: 0.3,
                  cursor: 'pointer',
                  overflow: 'hidden' } );
    window.gSaveFS2 =  // for "show FuncyStyle css string output"
    funcyStyle( '.box.fullsize',
                { width_px:boxSize,
                  height_px:boxSize,
                  margin:0 } );
}

window.onload = function() {
    build_example_css();
    document.getElementById('container').innerHTML = window.gRawHTML = build_example_html();
};