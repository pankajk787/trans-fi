const fs = require('fs');
const File = require('./models/file');
const connectDB = require('./config/db');

const deleteData = async () => {
    try{
        await connectDB();
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

        const files = await File.find({ createdAt: { $lt: pastDate } });
        console.log(`Found ${files.length} expired files.`);
        // TODO: Delete file from S3 bucket - when S3 is configured
        if(files.length > 0) {
            for(const file of files) {
                try{
                    // Check if the file exists in the storage
                    if(fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log(`File ${file.filename} deleted from STORAGE.`);
                    }
                    await file.deleteOne();
                    console.log(`File ${file.filename} deleted from DB.`);
                }
                catch(error) {
                    console.error(`Error deleting file ${file.filename}: `, error);
                }
            }
        }
        console.log("Job completed successfully.");
    } catch(error) {
        console.error("Error deleting expired files: ", error);
    }
    finally {
        console.log("********* Cron job completed ***********");
    }
}

// deleteData().then(process.exit)

module.exports = deleteData;