import { config } from "dotenv";
config();

const port = process.env.PORT;
const admin_email = process.env.ADMIN_EMAIL;
const admin_password = process.env.ADMIN_PASSWORD;
const database_url = process.env.DATABASE_URL;
const twilio_accountsid = process.env.TWILIO_ACCOUNTSID;
const twilio_authtoken = process.env.TWILIO_AUTHTOKEN;
const secret = process.env.SECRET;
const google_user = process.env.GOOGLE_USER;
const google_pass = process.env.GOOGLE_PASS;
const slack_api_token = process.env.SLACK_API_TOKEN;

export default () => ({
    port,
    admin_email,
    admin_password,
    database_url,
    twilio_accountsid,
    twilio_authtoken,
    secret,
    google_user,
    google_pass,
    slack_api_token,
});
