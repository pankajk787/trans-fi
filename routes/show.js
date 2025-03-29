const express = require("express");
const router = express.Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const file = await File.findOne({ uuid });
    
        if(!file) {
            return res.render("download", { error: "File not found" });
        }

        res.render("download", { 
            uuid: file.uuid,
            filename: file.filename,
            size: file.size,
            download_url: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
         });
    }
    catch(err) {
        return res.render("download", { error: "Error retrieving file" });
    }
});

module.exports = router;