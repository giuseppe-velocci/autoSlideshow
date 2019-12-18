const ccsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-core');
const jpeg = require('jpeg-js');
const path = require('path');
const fs = require('fs');

// number of channels of input image
const NUMBER_OF_CHANNELS = 3;


// transfor image into rgba values
const readImage = (path) => {
    const buf = fs.readFileSync(path)
    const pixels = jpeg.decode(buf, true)
    return pixels
}
// convert the image from rgba to rgb
const imageByteArray = (image, numChannels) => {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);
  
    for (let i = 0; i < numPixels; i++) {
      for (let channel = 0; channel < numChannels; ++channel) {
        values[i * numChannels + channel] = pixels[i * 4 + channel];
      }
    }

    // console.log(values);
    return values
}
// convert image to tensor3d
const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels);
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');
  
    return { t3d: input, width:image.width, height:image.height, rgb:values };
}

// function that detects main color
// SUUUPER SLOOOOOOW!!
const getMainColor = (rgb) => {
  const mainColor = {r:0, g:0, b:0};
  const imgColors = {c:[], max:{val:0, freq:0}};
  let index;
  const len = rgb.length;

  for (let i=0; i < len; i+=3) {
    index = ''+rgb[i]+'.'+rgb[i+1]+'.'+rgb[i+2];
    if (imgColors.c[index] == undefined) {
      imgColors.c[index] = 1;
    }else{
      imgColors.c[index]++;
    }
    if (imgColors.c[index] > imgColors.max.freq) {
      imgColors.max.val  = index;
      imgColors.max.freq = imgColors.c[index]; 
    }
  }
  const res = imgColors.max.val.split('.');
  mainColor.r = res[0];
  mainColor.g = res[1];
  mainColor.b = res[2];

  return mainColor;
}

// get main color by bounding box
const getMainColorByBoundingBox = (rgb, bx, by, bw, bh, width, height) => {
  const mainColor = {r:0, g:0, b:0};
  const imgColors = {c:[], max:{val:0, freq:0}};
  bx = Math.round(bx);
  by = Math.round(by);

//  console.log(bx, by, bw, bh);
//  console.log(rgb.length);

  // start = ox
  const startx = NUMBER_OF_CHANNELS * (bx + by * width);
  const endx = startx + width * NUMBER_OF_CHANNELS;
  let stepx, id;

  for (let j = 0; j < bh; j++) {
    stepx = width * j * NUMBER_OF_CHANNELS;
    for (let i = startx; i < endx; i += 3) {
      id = i + stepx;
      index = ''+rgb[id]+'.'+rgb[id +1]+'.'+rgb[id +2];
      if (imgColors.c[index] == undefined) {
        imgColors.c[index] = 1;
      }else{
        imgColors.c[index]++;
      }
      if (imgColors.c[index] > imgColors.max.freq) {
        imgColors.max.val  = index;
        imgColors.max.freq = imgColors.c[index]; 
      }
    }
  }
 // console.log(imgColors);
  const res = imgColors.max.val.split('.');
  mainColor.r = res[0];
  mainColor.g = res[1];
  mainColor.b = res[2];

  return mainColor;
}


// function that checks extension for images to ensure ONLY jpg will be parsed
const correctImgExtension = (imagePath, ext) => {
  let splitPath = path.parse(imagePath);
  if(ext.length == undefined) {
    if (splitPath.ext != ext)
      return false;
  } else {
    for (let i = 0; i < ext.length; i++) {
      if (splitPath.ext != ext[i])
        return false;
    }
  }
  return true;
}

// public function
async function detect (imagePath) {
    if (correctImgExtension (imagePath, ['jpg', 'jpeg'])) {
      return {};
    }
    
    const image = readImage(imagePath);
    const input = imageToInput(image, NUMBER_OF_CHANNELS);
  
    const model = await ccsd.load();
    const detection = await model.detect(input.t3d);

    // color detection
    input.mainColor = getMainColor(input.rgb);
    console.log(detection);
    for (let i = 0; i < detection.length; i++) {
      detection[i]['objColor'] = getMainColorByBoundingBox (
        input.rgb, 
        detection[i].bbox[0], 
        detection[i].bbox[1], 
        detection[i].bbox[2], 
        detection[i].bbox[3], 
        input.width, 
        input.height);
    }

    const result = {detection: detection, width: input.width, height: input.height, mainColor: input.mainColor, image:imagePath};
      console.log('classification results: ', result);
      console.log(imagePath);
      console.log(input.mainColor);

    return result;
}

module.exports = {
  detect
}