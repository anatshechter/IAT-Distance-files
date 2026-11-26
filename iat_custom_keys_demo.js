define(['pipAPI', 'https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/qualtrics/quiat9.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();

    var KEY_GROUPS = [
        { name: 'EI', left: 'e', right: 'i' },
        { name: 'TY', left: 't', right: 'y' },
        { name: 'QP', left: 'q', right: 'p' }
    ];
    var assigned = (typeof window !== 'undefined' && window.IAT_KEYGROUP) ? String(window.IAT_KEYGROUP).toUpperCase() : '';
    var g = KEY_GROUPS.filter(function (x){ return x.name === assigned; })[0] || KEY_GROUPS[0];
    try { window.IAT_KEYGROUP = g.name; } catch (e) {}

    var script = iatExtension({
        category1 : {
            name : 'Black people',
            title : { media : {word : 'Black people'}, css : {color:'#31940F','font-size':'2em'}, height : 4 },
            stimulusMedia : [
                {image : 'black1.jpg'}, {image : 'black2.jpg'}, {image : 'black3.jpg'},
                {image : 'black4.jpg'}, {image : 'black5.jpg'}, {image : 'black6.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'1.8em'}
        },
        category2 : {
            name : 'White people',
            title : { media : {word : 'White people'}, css : {color:'#31940F','font-size':'2em'}, height : 4 },
            stimulusMedia : [
                {image : 'yf1.jpg'}, {image : 'yf4.jpg'}, {image : 'yf5.jpg'},
                {image : 'ym2.jpg'}, {image : 'ym3.jpg'}, {image : 'ym5.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'1.8em'}
        },

        base_url : { image : 'https://baranan.github.io/minno-tasks/images/' },
        fullscreen : true,

        // ---- DEMO: short blocks ----
        blockAttributes_nTrials : 2,     blockAttributes_nMiniBlocks : 1,
        blockCategories_nTrials : 2,     blockCategories_nMiniBlocks : 1,
        blockFirstCombined_nTrials : 4,  blockFirstCombined_nMiniBlocks : 1,
        blockSecondCombined_nTrials : 4, blockSecondCombined_nMiniBlocks : 1,
        blockSwitch_nTrials : 2,         blockSwitch_nMiniBlocks : 1,

        leftKeyText  : 'Press "' + g.left.toUpperCase()  + '" for',
        rightKeyText : 'Press "' + g.right.toUpperCase() + '" for'
    });

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
