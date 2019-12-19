// child process forked from processAnalyze.js script
const tflow = require('./ts-img-action');

(async function(){
    console.log(process.argv);
    if (typeof(process.argv[4]) == 'undefined' || typeof(process.argv[5]) == 'undefined') {
        throw new Error("Missing arguments");
    }

    const folder = process.argv[4]; // string with folder path
    const images = JSON.parse(process.argv[5]); //  of images name
    const imgLen = images.length;
    for (let i = 0; i < imgLen; i++) {
        try {
            const res = await tflow.detect(folder + '/' + images[i]);
            process.send(res);
        } catch (e) {
            console.warn(e); // no error throwing to prevent blocking
        }
    }
})();