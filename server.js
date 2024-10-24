import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import fs from "fs";


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async (req, res) => {
    if(!req.query.image_url){
      res.status(422).send("image url cannot empty")
    }
    let fileUpload = req?.query?.image_url;
    try {
      let fileName = await filterImageFromURL(fileUpload)
      res.status(200).sendFile(fileName, function (err) {
        console.log(err)
      })
    } catch(err) {
      console.error(err)
      deleteFile();

      if("E_UNKNOWN_IMAGE_FORMAT" === err.message) {
        res.status(422).send("image url wrong image format")
      } else
      res.status(500).send("Internal Server Error")
    }
  } );

  function deleteFile(){
    var fileList = new Array;
        const files = fs.readdirSync("/tmp");
        files.forEach(file => {
          fileList.push("/tmp/" + file);
        });  
        deleteLocalFiles(fileList);
  }
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
