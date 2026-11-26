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

    var g = KEY_GROUPS[Math.floor(Math.random() * KEY_GROUPS.length)];

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

    /* 3. Rewrite the keys that are actually RECORDED. quiat9.js puts
          key:'e' (handle 'left') and key:'i' (handle 'right') in the
          `sort` input array. Find those two inputs in the built script
          and set their key to the assigned pair. */
    (function remap(root, leftKey, rightKey){
        var seen = (typeof WeakSet !== 'undefined') ? new WeakSet() : null;
        function walk(obj){
            if (!obj || typeof obj !== 'object') return;
            if (seen){ if (seen.has(obj)) return; seen.add(obj); }
            if (obj.on === 'keypressed' && (obj.handle === 'left' || obj.handle === 'right')){
                obj.key = (obj.handle === 'left') ? leftKey : rightKey;
            }
            if (Array.isArray(obj)){
                for (var i = 0; i < obj.length; i++) walk(obj[i]);
            } else {
                for (var k in obj){ if (Object.prototype.hasOwnProperty.call(obj, k)) walk(obj[k]); }
            }
        }
        walk(root);
    })(script, g.left, g.right);

    return script;
});
