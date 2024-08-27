const multer = require("multer");
const path = require("path");

module.exports = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new multer.MulterError("Arquivo Inválido !"));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, path.resolve(__dirname, "..", "..", "public", "uploads")); 
    },
    filename: (res, file, cb) => { 
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    },
  }),
};
