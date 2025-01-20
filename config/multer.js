import multer from "multer";
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/profile-image/',
    filename: (req, file, cb) => {
        // Determine the file extension from the MIME type
        let extension = '';
        switch (file.mimetype) {
            case 'image/png':
                extension = '.png';
                break;
            case 'image/jpeg':
                extension = '.jpg';
                break;
            case 'image/jpg':
                extension = '.jpg';
                break;
            default:
                extension = ''; // Fallback if MIME type is not recognized
        }

        const filename = `${Date.now()}-${file.fieldname}${extension}`;
        cb(null, filename);
    }
})

// Initial upload
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 10 MB
    fileFilter : ( req, file, cb)=>{
        checkFileType(file,cb)
    }
})

// Check file type
function checkFileType(file, cb) {
    // Allowed mime types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

    if (isValidMimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only JPEG and PNG images are allowed!'));
    }
}

export default upload;