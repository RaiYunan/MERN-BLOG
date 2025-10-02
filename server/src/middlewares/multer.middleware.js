import multer from "multer";
/*This code configures Multer to:

Store uploaded files in the "public/temp" folder.

Rename files with a unique name (timestamp + random number).

Make upload available to be used in Express routes.*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  export const upload = multer({ storage: storage }) 
  