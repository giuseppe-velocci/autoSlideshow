const childProcess = require('child_process');
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


// function to assign image to process
const img2process = (data) => {
    return toProcess = data.filter(x => x.status == TO_PROCESS)[0]; // returns undefined when empty
}

// function to spawn a child
const callChild = (imgname) => {
    return childProcess.fork(
        __dirname + '/childprocess', // path script 
        ['-r', 'esm', imgname],    // array param to be passed to cli
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
    if (activeProcessesCount == 0)
        return true;

    return false;
}


// 
const multiCall = async (folder, images) => {
    const imgdata = setupData(folder, images);
    let nextImg;
    return new Promise(res => {
    for (let i = 0; i < numCPUs; i++) {
        nextImg = img2process(imgdata);
        
        if (typeof(nextImg) == 'undefined') {
            processes[i] = null;
        } else {
            nextImg.status = PROCESSING;
            processes[i] = { process: callChild(nextImg.url), image: nextImg.url };

            // add event listeners
            processes[i].process.on('data', (data) => {
                // ...
                // console.log(data);
            });
            // error
            processes[i].process.on('error', (code) => {
                // force kill
                processes[i].image.status = ERROR;
                if (! processes[i].process.kill()) {
                    processes[i] = null;
                }
                if (isAnalysisComplete()) {
                    res(true);
                }
            });
            // message
            processes[i].process.on('message', (data) => {
                console.log(processes[i].image);
                processes[i].image.status = COMPLETE;
                // store results
                // ...
            });
            // close
            processes[i].process.on('close', (code) => {
                // check if there are more images, then restart process
                nextImg = img2process(imgdata);
                // console.log(nextImg);
                if (typeof(nextImg) == 'undefined') {
                    processes[i] = null;
                } else {
                    nextImg.status = PROCESSING;
                    processes[i] = { process: callChild(nextImg.url), image: nextImg.url };
                }
                if (isAnalysisComplete()) {
                    res(true);
                }
            });    
        }
    }
    });
};

// tests
/*
multiCall('D:\\giuse\\Documents\\ITS_2018_20\\NodeJs\\testslideshow\\tensorflow-img\\finalNodePrj\\img', 
['cars.jpg', 'dogPerson.jpg', 'trump.jpg']);
 */