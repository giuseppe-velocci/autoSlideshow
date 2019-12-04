// process.chdir(__dirname);
const tflow = require(__dirname + '/ts-img-action');

(async function(){
    const imagePath = process.argv[4];
    if (typeof(imagePath) == 'undefined') {
        throw new Error("No file provided");
    }
    try {
        const res = await tflow.detect(imagePath);
        process.send(res);
    } catch (e) {
        throw e;
    }   
})();