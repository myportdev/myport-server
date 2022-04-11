import aws from "aws-sdk";
import configuration from "../configuration.js";
aws.config.update({
    accessKeyId: configuration().s3_access_key_id,
    secretAccessKey: configuration().s3_secret_access_key,
    region: "ap-northeast-2",
});
let s3 = new aws.S3();

const delete_team_s3_object = (location) => {
    s3.deleteObject(
        {
            Bucket: "myport-app-bucket",
            Key: `${project_image_key[3]}/${project_image_key[4]}/${project_image_key[5]}`,
        },
        (error, data) => {
            if (error) {
                throw error;
            }
        }
    );
};

export { delete_team_s3_object };
