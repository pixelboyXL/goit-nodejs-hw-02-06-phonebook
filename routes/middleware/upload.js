const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../tmp"),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
});

module.exports = {
    upload,
};