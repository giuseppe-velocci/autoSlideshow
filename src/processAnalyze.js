console.log(process.memoryUsage());
const process = require('child_process');
const numCPUs = require('os').cpus().length;
const processes = [];

// image obj status
const TO_PROCESS = 0;
const PROCESSING = 1;
const COMPLETE   = 2;
const ERROR = 3;

/** function to setup data objects (called ONCE at the beginning)
 * @folder  = string, selected folder
 * @imgList = array of strings with files inside @folder
 * @return  = array with analysis-ready objects
*/
const setupData = (folder, imgList) => {
    const data = [];

    for(let i=0; i < validImgsNum; i++) {
        data.push(
            {
                url: folder + '/' + imgList[i],
                status: TO_PROCESS,
                result: []
            }
        );
    }
    return data;
}


// function to spawn a child
const callChild = (fileObj) => {
    if (images.length <= processedImages) {
        return null;
    }

    return child_process.fork(
        __dirname +'/childprocess',       // path script 
        ['-r', 'esm'],          // array param to be passed to cli
        {                       // options
            
        }
    );
};


const multiCall = (nome, images, processedImages) => {
    for (let i = 0; i < numCPUs; i++) {
        processes.push(callChild);
        if (processes[i] == null) {
            return;
        }
        // add event listeners
        processes[i].on('data', (code) => {

        });
        // error
        processes[i].on('error', (code) => {

        });
        // message
        processes[i].on('message', (code) => {
            // check 
        });
        // close
        processes[i].on('close', (code) => {
            processes[i] = null;
        });

    }
};
