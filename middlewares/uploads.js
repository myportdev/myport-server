import path from "path";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3-transform";
import sharp from "sharp";
import configuration from "../configuration.js";

aws.config.update({
    accessKeyId: configuration().s3_access_key_id,
    secretAccessKey: configuration().s3_secret_access_key,
    region: "ap-northeast-2",
});
let s3 = new aws.S3();

const profile_upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "myport-app-bucket/myport-images/profile",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "Large",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, "Large/" + Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize({ width: 120, height: 120, fit: sharp.fit.contain }));
                },
            },
            {
                id: "Medium",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, "Medium/" + Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(104, 104));
                },
            },
            {
                id: "Small",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, "Small/" + Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(48, 48));
                },
            },
        ],
        acl: "public-read-write",
    }),
});

const team_image_upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "myport-app-bucket/myport-images/team_images",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "Team",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(88, 120));
                },
            },
        ],
        acl: "public-read-write",
    }),
});

const project_image_upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "myport-app-bucket/myport-images/projects",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "project",
                key: function (req, file, cb) {
                    let extension = path.extname(file.originalname);
                    cb(null, Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    if (file.fieldname == "introdution") {
                        cb(null, sharp());
                        return;
                    }
                    cb(null, sharp().resize(156, 120));
                },
            },
        ],
        acl: "public-read-write",
    }),
});

export { profile_upload, team_image_upload, project_image_upload };
