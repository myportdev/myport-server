import aws_parameter_store from "./config/env.js";

const port = aws_parameter_store().PORT;
const admin_email = aws_parameter_store().ADMIN_EMAIL;
const admin_password = aws_parameter_store().ADMIN_PASSWORD;
const database_url = aws_parameter_store().DATABASE_URL;
const twilio_accountsid = aws_parameter_store().TWILIO_ACCOUNTSID;
const twilio_authtoken = aws_parameter_store().TWILIO_AUTHTOKEN;
const secret = aws_parameter_store().SECRET;
const email_user = aws_parameter_store().EMAIL_USER;
const email_pass = aws_parameter_store().EMAIL_PASS;
const slack_api_token = aws_parameter_store().SLACK_API_TOKEN;
const s3_access_key_id = aws_parameter_store().S3_ACCESS_KEY_ID;
const s3_secret_access_key = aws_parameter_store().S3_SECRET_ACCESS_KEY;

export default () => ({
    port,
    admin_email,
    admin_password,
    database_url,
    twilio_accountsid,
    twilio_authtoken,
    secret,
    email_user,
    email_pass,
    slack_api_token,
    s3_access_key_id,
    s3_secret_access_key,
});
