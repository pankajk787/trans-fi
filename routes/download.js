const express = require('express');
const File = require('../models/file');
const router = express.Router();

router.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const file = await File.findOne({ uuid });
        if(!file) {
            return res.render('download', { error: 'File not found' });
        }

        const filePath = `${__dirname}/../${file.path}`;

        res.download(filePath);
    }

    catch(err) {
        return res.render('download', { error: 'Error retrieving file' });
    }
});

module.exports = router;