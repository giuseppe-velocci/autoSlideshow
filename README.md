# finalNodePrj
Auto slideshow for images with object detection to ensure relevant bounds will be displayed during animation.

First install dependencies with:

`npm install`

<br>To start the project run on cmd:

`npm start`

<br>**Using the Electron App**
<br>From the electron window click the Analyze Folder button to select a folder containing .jpg files to be analyzed by TensorFlowJs (powered by the pre-trained cocoSsd model). Then click start and wait for the processes to be completed (the number of processes forked depends on both the number of images and cores of the device).

<br>After this phase is completed click the Go To Animation button to select a class of objects you want to be displayed in a browser animation that emphasizes the outer bound detected.

**Get output data**
<br>Analyzed data will be stored inside the */src/categories* folder. A single folder named after the detected class will be created under this path. Each folder will hold a copy of the photos and a single *detect.json* file with the relevant data.

<br>To empty the *src/categories* folder just click the Delete All button on the upper-right corned under Select Images to Animate.
