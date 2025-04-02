const path = require('node:path');
const express = require("express");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require("../models/file");
const router = express.Router();

// Multer configuration
// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`; // generate a unique name for the file
        cb(null, fileName);
    }
});

// Set up multer middleware
let upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).single('myfile');

router.post('/', (req, res) => {
    // Store file
    upload(req, res, async (err) => {
        // validate request
        if(!req.file) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(err) {
            return res.status(500).json({ message: 'Error uploading file' });
        }

        // Store into db
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size,
            // sender: req.body.sender,
            // receiver: req.body.receiver,
        })

        const response = await file.save();

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    })
})

router.post('/send', async (req, res) => {
    const { uuid, email_from, email_to } = req.body;
    if(!uuid || !email_from || !email_to) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const file = await File.findOne({ uuid });
        if(file.sender) {
            return res.status(400).json({ message: 'Email already sent' });
        }
        file.sender = email_from;
        file.receiver = email_to;

        file.save();

        //send email
        const sendMail = require("../services/email-service");
        sendMail({
            from: email_from,
            to: email_to,
            subject: 'Trans-Fi - File shared',
            text: `${email_from} shared a file with you.`,
            html: require("../services/email-template")({
                emailFrom: email_from,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1024) + ' KB',
                expires: 24,
            }),
        })

        return res.status(200).json({ success: true });
    }
    catch(err) {
        return res.status(500).json({ message: 'Error sending email' });
    }
})

module.exports = router;