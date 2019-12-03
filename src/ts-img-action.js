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
    return values
}
// convert image to tensor3d
const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels);
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');
  
    return { t3d: input, width:image.width, height:image.height };
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
    console.log(imagePath);
    
    const image = readImage(imagePath);
    const input = imageToInput(image, NUMBER_OF_CHANNELS);
  
    const model = await ccsd.load();
    const detection = await model.detect(input.t3d);
    const result = {detection: detection, width: input.width, height: input.height};
      console.log('classification results: ', result);
    return result;
}