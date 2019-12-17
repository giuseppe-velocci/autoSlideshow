const childProcess  = require('child_process');
const archiveRouter = require ("./archiveRouter.js");
const updateJson = require("./updateJson.js")
const numCPUs    = require('os').cpus().length;
const processes  = [];

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
    const validImgsNum = imgList.length;

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

// filter images from array splitting them in equal parts among processes
// filters only jpeg files!
const splitInEqualParts = (data, shardNumber) => {
    data = data.filter(x => /\.(jpg|jpeg)$/.test(x));
    const len   = data.length;
    const shard = Math.floor(len / shardNumber);
    const remainder = len % shardNumber;
    const splitData = [];

    if (len < shardNumber) {
        for (let i = 0; i < data.length; i++) {
            splitData.push([]);
            splitData[i].push(data[i]);
        }
        return splitData;
        
    }

    for (let i = 0; i < shardNumber; i++) {
        splitData.push([]);
        for (let j= 0; j < shard; j++) {
            splitData[i].push(data[i * shard +j]);
        }
    }

    for (let i = remainder; i >= 1 ; i--) {
        splitData[i-1].push(data[len - i])
    }

    return splitData;
}



// function to assign image to process
const img2process = (data) => {
   return toProcess = data.filter(x => x.status == TO_PROCESS)[0]; // returns undefined when empty
}

// function to spawn a child
const callChild = (folder, imgnames) => {
    return childProcess.fork(
        __dirname + '/childprocess', // path script 
        ['-r', 'esm', folder, imgnames],    // array param to be passed to cli
        {                         // options
            
        }
    );
};

// function to check if analyzing process has finished
const isAnalysisComplete = () => {
    let activeProcessesCount = 0;
    for (let i = 0; i < processes.length; i++) {
        if (processes[i] != null)
            activeProcessesCount++;
    }
    //console.log(processes);
    if (activeProcessesCount == 0)
        return true;

    return false;
}


// 
const multiCall = async (folder, images, callbackSuccess) => {
    const allImgLen = images.length;
    const splitData = splitInEqualParts (images, numCPUs);
    const imgDataStatus = setupData(folder, images);

    return new Promise(res => {
    for (let i = 0; i < splitData.length; i++) {
        processes[i] = callChild(folder, JSON.stringify(splitData[i])); // { process: callChild(folder, JSON.stringify(splitData[i])), image: nextImg.url };

        // message
        processes[i].on('message', (data) => {
            callbackSuccess();
            // store results
            for(j=0; j<data.detection.length; j++)
            {
                //console.log(data);
               
                let folder = archiveRouter.destinationFolder(data.detection[j].class);
                let name = data.image.split("/");
                archiveRouter.copyImg(data.image, folder +"/" +name[1]);
                let result = {width: data.width, height: data.height, detection: data.detection[j], mainColor:data.mainColor};
                updateJson.updateJson(name[1], folder, result);
                
            }
            let imgCompleted = imgDataStatus.filter(x=> x.url == data.image)[0].status = COMPLETE;
            progress.innerHtml = 100 * Math.round(imgCompleted.length / allImgLen) + '%';
            if (isAnalysisComplete()) {
                res(true);
            }
        });
        // close
        processes[i].on('close', (code) => {
            processes[i] = null;
            if (isAnalysisComplete()) {
                res(true);
            }
        }); 
        // error
        processes[i].on('error', (code) => {
            // force kill
            if (! processes[i].kill()) {
                processes[i] = null;
            }
            if (isAnalysisComplete()) {
                res(true);
            }
        });   
    }
    });
};