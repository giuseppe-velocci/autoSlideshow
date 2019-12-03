const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const numCPUs = require('os').cpus().length;


const runWorkers = async (allImages, processedImages, workers, asyncCallback) => {
    if (workers.length >= numCPUs) {
        return;
    }

    if (isMainThread) {
        return new Promise((resolve, reject) => {
                workers.push(new Worker(__filename, {
                workerData: script
            }));
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });       
        
    } else {
        asyncCallback(workerData);
        console.log(workerData);  // Prints 'Hello, world!'.
    }
    
}


