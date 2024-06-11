import multer from 'multer'
import path from 'path'
const publicPath = path.resolve(__dirname, '../public/images');

const upload = multer({
  storage: multer.diskStorage({
    
    destination: function (path, file, cb) {
      console.log('file', publicPath);
      cb(null, publicPath);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});


export default upload;