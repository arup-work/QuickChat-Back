import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
    try {
        // Ensure filePath is absolute
        const fullPath = path.resolve(filePath);
        console.log(fullPath);
        

        // Check if the file exists
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath); //Delete the file
            console.log(`File deleted: ${fullPath}`);
        }else{
            console.log(`File not found: ${fullPath}`);
        }
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
}

export default deleteFile;