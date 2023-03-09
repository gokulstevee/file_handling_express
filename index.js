const express = require('express');
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const app = express();

// cloudinary configuration
cloudinary.config({
  //from .env file
  cloud_name: '',
  api_key: '',
  api_secret: '',
});

// this calls the "views" folder implicitly where the ejs files are excisted
app.set('view engine', 'ejs');

app.use(express.json());

// it uses "form-urlencoded" or "form-data", so the data is sent via url by encoding the data
app.use(express.urlencoded({ extended: true }));

//fileUpload middleware used to setup a temporary dir untill the file uploading process complete
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.get('/myget', (req, res) => {
  res.json(req.body);
});

app.post('/postform', async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  let result;
  let imageArray = [];

  // # Case of multiple images

  if (req.files) {
    for (let i = 0; i < req.files.samplefile.length; i++) {
      let result = await cloudinary.uploader.upload(
        req.files.samplefile[i].tempFilepath,
        { folder: 'users' }
      );
      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  // # Case of single image

  // let file = req.files.samplefile;
  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  let details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
    imageArray,
  };
  console.log(details);

  res.send(details);
});

//This renders ejs
app.get('/getform', (req, res) => {
  res.render('get_form'); // It renders the get_form ejs file
});

app.get('/postform', (req, res) => {
  res.render('post_form');
});

app.listen(4000, () => {
  console.log(`Port is running at ${4000}`);
});
s