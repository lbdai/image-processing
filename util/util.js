import axios from "axios";
import fs from "fs";
import Jimp from "jimp";
import fileType from "file-type";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the image from the URL
      const response = await axios({
        method: 'get', 
        url: inputURL, 
        responseType: 'arraybuffer' // Ensure we get the data as a buffer
      });
      const imageBuffer = response.data;
      
      const type = await fileType.fromBuffer(imageBuffer);
      if (type && type.mime.startsWith('image/')) {
        const photo = await Jimp.read(imageBuffer);
        const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
        photo
          .resize(256, 256) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write(outpath, () => {
            resolve(outpath);
          });
      } else {
        throw new Error("E_UNKNOWN_IMAGE_FORMAT");
      }
    } catch (error) {
      reject(error);
    }
  });
}



export function getImageType(imageBuffer) {
  const type = fileType.fromBuffer(imageBuffer).then(data =>  {return data.mime}); // Wait for the Promise to resolve
    if (type) {
      console.log(type.mime); // Use the resolved data
    } else {
      console.log('Could not determine file type');
    }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
