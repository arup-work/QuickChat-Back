import multer from "multer";
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination : './public/profile-image/',
    filename : ( req, file, cb) => {
        const filename = `${Date.now()}-${file.fieldname}${".png"}`;
        cb(null, filename);
    }
})

// Initial upload
const upload = multer({
    storage,
    // limits: { fileSize: 1 * 1024 * 1024 }, // 10 MB
    // fileFilter : ( req, file, cb)=>{
    //     checkFileType(file,cb)
    // }
})

// Check file type
function checkFileType(file, cb) {
    // Allowed mime types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', ''];
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

    // Allowed extensions
    const filetypes = /jpeg|jpg|png/;
    const isValidExtName = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (isValidMimeType && isValidExtName) {
        return cb(null, true);
    }else{
        cb(new Error('Error: Only JPEG and PNG images are allowed!'));
    }
}

export default upload;