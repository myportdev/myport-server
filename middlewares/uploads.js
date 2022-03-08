import path from "path";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
const __dirname = path.resolve();
aws.config.loadFromPath(__dirname + "/config/s3.json");
let s3 = new aws.S3();
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "myport-bucket/myport-images",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension);
        },
        acl: "public-read-write",
    }),
});

export default upload;
