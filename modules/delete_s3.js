import aws from "aws-sdk";
import configuration from "../configuration.js";
aws.config.update({
    accessKeyId: configuration().s3_access_key_id,
    secretAccessKey: configuration().s3_secret_access_key,
    region: "ap-northeast-2",
});
let s3 = new aws.S3();

const delete_profile_s3_object = (image_large_key, image_medium_key, image_small_key) => {
    const params = {
        Bucket: "myport-app-bucket",
        Delete: {
            Objects: [
                {
                    Key: `${image_small_key[3]}/${image_small_key[4]}/${image_small_key[5]}/${image_small_key[6]}`,
                },
                {
                    Key: `${image_medium_key[3]}/${image_medium_key[4]}/${image_medium_key[5]}/${image_medium_key[6]}`,
                },
                {
                    Key: `${image_large_key[3]}/${image_large_key[4]}/${image_large_key[5]}/${image_large_key[6]}`,
                },
            ],
        },
    };
    let s3 = new aws.S3();
    s3.deleteObjects(params, function (error, data) {
        if (error) {
            throw error;
        }
        return;
    });
};

const delete_project_s3_object = (project_image_key) => {
    s3.deleteObject(
        {
            Bucket: "myport-app-bucket",
            Key: `${project_image_key[3]}/${project_image_key[4]}/${project_image_key[5]}`,
        },
        (error, data) => {
            if (error) {
                throw error;
            }
            return;
        }
    );
};

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

export { delete_project_s3_object, delete_profile_s3_object, delete_team_s3_object };
