const multer = require("multer");
const path = require('path');

const tmpDir = path.join(__dirname, "..", "tmp")

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    console.log(file);
    cb(null, tmpDir)
  
}})

const upload = multer({
  storage
})

module.exports = upload;

