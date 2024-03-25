var multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'src/public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const uploadImg = multer({
  storage: storage,
});

exports.uploadImg = uploadImg;
