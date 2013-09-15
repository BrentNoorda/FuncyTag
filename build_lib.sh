#!/bin/bash
# build javascript funcytag.js and funcystyle.js and funcytagstyle.js from components in src

VERSION="0.0.4"
FUNCYTAG_JS="lib/funcytag.$VERSION.js"
FUNCYTAG_MIN_JS="lib/funcytag.$VERSION.min.js"
FUNCYSTYLE_JS="lib/funcystyle.$VERSION.js"
FUNCYSTYLE_MIN_JS="lib/funcystyle.$VERSION.min.js"
COMBINED_JS="lib/funcytag_and_style.$VERSION.js"
COMBINED_MIN_JS="lib/funcytag_and_style.$VERSION.min.js"
DEBUG="true"

echo
echo building $FUNCYTAG_JS, $FUNCYTAG_MIN_JS, $FUNCYSTYLE_JS, $FUNCYSTYLE_MIN_JS, $COMBINED_JS, and $COMBINED_MIN_JS
echo

echo "/*jslint white:false plusplus:false browser:true nomen:false */" > $FUNCYTAG_JS
echo "/*globals window, console, funcyStyle, alert*/" >> $FUNCYTAG_JS
echo "/* FuncyTag version $VERSION - see more at https://github.com/BrentNoorda/FuncyTag */" >> $FUNCYTAG_JS
echo "" >> $FUNCYTAG_JS

echo "/*jslint white:false plusplus:false browser:true nomen:false */" > $FUNCYSTYLE_JS
echo "/*globals window, console, alert*/" >> $FUNCYSTYLE_JS
echo "/* FuncyStyle version $VERSION - see more at https://github.com/BrentNoorda/FuncyTag */" >> $FUNCYSTYLE_JS
echo "" >> $FUNCYSTYLE_JS

echo "/*jslint white:false plusplus:false browser:true nomen:false */" > $COMBINED_JS
echo "/*globals window, console, alert*/" >> $COMBINED_JS
echo "/* FuncyTag and FuncyStyle (combined) version $VERSION - see more at https://github.com/BrentNoorda/FuncyTag */" >> $COMBINED_JS
echo "" >> $COMBINED_JS

echo "(function(window) {" >> $FUNCYTAG_JS
echo "(function(window) {" >> $FUNCYSTYLE_JS
echo "(function(window) {" >> $COMBINED_JS

echo "    var gCamelToDashRegexp," >> $FUNCYTAG_JS
echo "    var gCamelToDashRegexp," >> $FUNCYSTYLE_JS
echo "    var gCamelToDashRegexp," >> $COMBINED_JS

echo "        gNextUniqueId, gUniqueLen, gNextIdChar, gInitQueue, gElems," >> $FUNCYTAG_JS
echo "        gNextUniqueId, gUniqueLen, gNextIdChar, gInitQueue, gElems," >> $COMBINED_JS

echo "        gGCTimeout, gRenderTimeout, styles_not_injected," >> $FUNCYTAG_JS
echo "        gGCTimeout, gRenderTimeout, styles_not_injected," >> $COMBINED_JS

echo "        recursive," >> $FUNCYSTYLE_JS
echo "        recursive," >> $COMBINED_JS

echo "        DEBUG=$DEBUG;" >> $FUNCYTAG_JS
echo "        DEBUG=$DEBUG;" >> $FUNCYSTYLE_JS
echo "        DEBUG=$DEBUG;" >> $COMBINED_JS

echo "" >> $FUNCYTAG_JS
echo "" >> $FUNCYSTYLE_JS
echo "" >> $COMBINED_JS

cat src/funcy_common.js.src >> $FUNCYTAG_JS
cat src/funcy_common.js.src >> $FUNCYSTYLE_JS
cat src/funcy_common.js.src >> $COMBINED_JS

cat src/funcystyle.js.src >> $FUNCYSTYLE_JS
cat src/funcystyle.js.src >> $COMBINED_JS
echo "" >> $COMBINED_JS
cat src/funcytag.js.src >> $FUNCYTAG_JS
cat src/funcytag.js.src >> $COMBINED_JS

echo "" >> $COMBINED_JS

echo "}(window));" >> $FUNCYTAG_JS
echo "}(window));" >> $FUNCYSTYLE_JS
echo "}(window));" >> $COMBINED_JS

cp $FUNCYTAG_JS $FUNCYTAG_MIN_JS
cp $FUNCYSTYLE_JS $FUNCYSTYLE_MIN_JS
cp $COMBINED_JS $COMBINED_MIN_JS
