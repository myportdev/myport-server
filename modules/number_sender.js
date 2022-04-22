import twilio from "twilio";
import configuration from "../configuration.js";

let client = new twilio(configuration().twilio_accountsid, configuration().twilio_authtoken);

let random_number = (min, max) => {
    let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return ranNum;
};

const number_sender = {
    send_number: async function (number) {
        const rd_number = await random_number(11111, 99999);
        client.messages.create({
            body: "FOLIO 회원가입 인증 번호를 입력해주세요 : " + rd_number,
            to: "+82" + number,
            from: "+19402456656",
        });
        return rd_number;
    },
};

export default number_sender;
