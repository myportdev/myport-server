import { config } from "dotenv";
config();

const port = process.env.PORT;
const admin_email = process.env.ADMIN_EMAIL;
const admin_password = process.env.ADMIN_PASSWORD;
const database_url = process.env.DATABASE_URL;
const twilio_accountsid = process.env.TWILIO_ACCOUNTSID;
const twilio_authtoken = process.env.TWILIO_AUTHTOKEN;
const secret = process.env.SECRET;
const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;
const slack_api_token = process.env.SLACK_API_TOKEN;
const s3_access_key_id = process.env.S3_ACCESS_KEY_ID;
const s3_secret_access_key = process.env.S3_SECRET_ACCESS_KEY;

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
