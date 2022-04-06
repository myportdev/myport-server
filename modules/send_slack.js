import configuration from "../configuration.js";
import { WebClient, LogLevel } from "@slack/web-api";

const send_slack = async (name, date, phone_number, email, total_join, today_join) => {
    const client = new WebClient(configuration().slack_api_token, {
        logLevel: LogLevel.DEBUG,
    });
    const channelId = "C033K9THDS6";

    try {
        await client.chat.postMessage({
            channel: channelId,
            text: ` 대학생들을 위한 최고의 어플 myport에 ${name}님이 가입하셨습니다. ${date}
                    전화번호:${phone_number}
                    이메일:${email}
                    오늘 가입자 수: ${today_join}
                    총 가입 자수:${total_join}`,
        });
    } catch (error) {
        next(error);
    }
};

export default send_slack;
