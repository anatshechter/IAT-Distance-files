define(['pipAPI', 'https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/qualtrics/quiat9.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor(); // kept for parity with the template; not used below

    /* 1. Between-participant key assignment.
       Each pair is {left, right}: the key for the LEFT category and the
       key for the RIGHT category (left hand / right hand). */
    var KEY_GROUPS = [
        { name: 'EI', left: 'e', right: 'i' },
        { name: 'TY', left: 't', right: 'y' },
        { name: 'QP', left: 'q', right: 'p' }
    ];

    // read the group assigned by Qualtrics (falls back to EI if missing)
    var assigned = (typeof window !== 'undefined' && window.IAT_KEYGROUP) ? String(window.IAT_KEYGROUP).toUpperCase() : '';
    var g = KEY_GROUPS.filter(function (x){ return x.name === assigned; })[0] || KEY_GROUPS[0];
    // expose the assigned group so Qualtrics can store it
    try { window.IAT_KEYGROUP = g.name; } catch (e) {}

    /* 2. Build the task. leftKeyText/rightKeyText are the labels shown
          ABOVE the categories, so they must match the assigned keys. */
    var script = iatExtension({
        category1 : {
            name : 'Black people',
            title : {
                media : {word : 'Black people'},
                css : {color:'#31940F','font-size':'2em'},
                height : 4
            },
            stimulusMedia : [
                {image : 'black1.jpg'},
                {image : 'black2.jpg'},
                {image : 'black3.jpg'},
                {image : 'black4.jpg'},
                {image : 'black5.jpg'},
                {image : 'black6.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'1.8em'}
        },
        category2 : {
            name : 'White people',
            title : {
                media : {word : 'White people'},
                css : {color:'#31940F','font-size':'2em'},
                height : 4
            },
            stimulusMedia : [
                {image : 'yf1.jpg'},
                {image : 'yf4.jpg'},
                {image : 'yf5.jpg'},
                {image : 'ym2.jpg'},
                {image : 'ym3.jpg'},
                {image : 'ym5.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'1.8em'}
        },

        base_url : { image : 'https://baranan.github.io/minno-tasks/images/' },
        fullscreen : true,

        // labels above the categories
        leftKeyText  : 'Press "' + g.left.toUpperCase()  + '" for',
        rightKeyText : 'Press "' + g.right.toUpperCase() + '" for'
    });

    /* 3. Rewrite what is RECORDED and what the instructions SAY.
          - response inputs: key:'e'/'i' in the `sort` set -> assigned keys
          - instruction text: <b>E</b>/<b>I</b> -> assigned keys (uppercase) */
    (function remap(root, leftKey, rightKey){
        var seen = (typeof WeakSet !== 'undefined') ? new WeakSet() : null;
        var boldL = '<b>' + leftKey.toUpperCase()  + '</b>';
        var boldR = '<b>' + rightKey.toUpperCase() + '</b>';
        function fixStr(s){
            return s.split('<b>E</b>').join(boldL).split('<b>I</b>').join(boldR);
        }
        function walk(obj){
            if (!obj || typeof obj !== 'object') return;
            if (seen){ if (seen.has(obj)) return; seen.add(obj); }
            if (obj.on === 'keypressed' && (obj.handle === 'left' || obj.handle === 'right')){
                obj.key = (obj.handle === 'left') ? leftKey : rightKey;
            }
            if (Array.isArray(obj)){
                for (var i = 0; i < obj.length; i++){
                    if (typeof obj[i] === 'string') obj[i] = fixStr(obj[i]);
                    else walk(obj[i]);
                }
            } else {
                for (var k in obj){
                    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
                    if (typeof obj[k] === 'string') obj[k] = fixStr(obj[k]);
                    else walk(obj[k]);
                }
            }
        }
        walk(root);
    })(script, g.left, g.right);

    return script;
});
