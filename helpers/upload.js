const multer = require("multer");
const path = require("path");
const crypto =require("crypto");

const tmpDir = path.join(__dirname, "..", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, tmpDir);
  },
  filename: (req, file, cb)=>{
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const sufix = crypto.randomUUID();
    console.log(basename);
    cb(null, `${basename}-${sufix}${extname}`)
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
