import express from "express";
import { loginSchema, refreshSchema, registerSchema, authPhoneSchema, authEmailSchema, changePasswordSchema, existEmailSchema } from "../validations/user.js";
import validator from "express-joi-validation";
import bcrypt from "bcryptjs";
import cache from "../../util/cache.js";
import jwt_util from "../../util/jwt_util.js";
import jwt from "jsonwebtoken";
import user_service from "../services/user.js";
import configuration from "../../configuration.js";
import sharp from "sharp";
import { check_object_id } from "../../middlewares/objectid-valid.js";

const router = express.Router();
const verify = validator.createValidator({});

// register
import moment from "moment";
import { WebClient, LogLevel } from "@slack/web-api";
import upload from "../../middlewares/uploads.js";
router.post("/", upload.single("image"), async (req, res, next) => {
    const send = async (name, date, phone_number, email, total_join, today_join) => {
        const client = new WebClient(configuration().slack_api_token, {
            logLevel: LogLevel.DEBUG,
        });
        const channelId = "C033K9THDS6";

        try {
            const result = await client.chat.postMessage({
                channel: channelId,
                text: `대학생들을 위한 최고의 어플 myport에 ${name}님이 가입하셨습니다. ${date} 
                       전화번호:${phone_number} 
                       이메일:${email} 
                       오늘 가입자 수: ${today_join} 
                       총 가입 자수:${total_join}`,
            });
        } catch (error) {
            next(error);
        }
    };

    try {
        const { email, password, name, birth_date, phone_number, address, college, major, student_number, interest, gender, promotion } = req.body;
        let profile_image_url = "";
        if (req.file) {
            profile_image_url = req.file.location;
        }
        const hash_password = bcrypt.hashSync(password, 10);
        const user_status = await user_service.exist_user({ email });

        if (user_status) {
            res.status(400).json({
                message: "해당 이메일이 이미 존재합니다.",
            });
            return;
        }
        let interest_documents = [];
        if (interest) {
            const interest_array = interest.split(" ");
            interest_documents = await user_service.find_interest_array(interest_array);
        }

        const university = await user_service.find_university(college, major);

        const join_date = `${moment().format("YYYY년 MM월 DD일")} ${moment().format("HH시 mm분")}`;
        const user_data = {
            profile_image_url,
            email,
            hash_password,
            name,
            birth_date,
            phone_number,
            address,
            university,
            student_number,
            interest_documents,
            gender,
            promotion,
            join_date,
        };
        const user = await user_service.create_user(user_data);

        const total_user = await user_service.user_count();
        const join_data = await cache.get("today_join");

        await send(user.name, user.join_date, user.phone_number, user.email, total_user, parseInt(join_data) + parseInt(1));
        await cache.set("today_join", parseInt(join_data) + parseInt(1));

        res.status(201).json({
            message: "success register",
        });
    } catch (error) {
        next(error);
    }
});

// login
router.post("/token", verify.body(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_service.get_user({ email });
        if (user) {
            const result_password = bcrypt.compareSync(password, user.password);
            if (result_password) {
                const accessToken = jwt_util.sign(user.id);
                const refreshToken = jwt_util.refresh();
                await cache.set(user.id, refreshToken);
                res.status(200).json({
                    message: "success login",
                    token: {
                        user_id: user.id,
                        accessToken,
                        refreshToken,
                    },
                });
                return;
            }
        }
        res.status(401).json({
            message: "fail login",
        });
    } catch (error) {
        next(error);
    }
});

// logout
router.post("/logout/:user_id", check_object_id, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user_status = await user_service.exist_user({ user_id });
        if (!user_status) {
            res.status(400).json({
                message: "fail logout",
            });
            return;
        }
        await cache.del(user_id);
        res.status(200).json({
            message: "success logout",
        });
    } catch (error) {
        next(error);
    }
});

// refresh token
router.get("/refresh", verify.headers(refreshSchema), async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.refresh) {
            res.status(400).send({
                ok: false,
                message: "Access token and refresh token are need for refresh!",
            });
        }
        const authToken = req.headers.authorization.split("Bearer ")[1];
        const refreshToken = req.headers.refresh;
        const authResult = jwt_util.verify(authToken);

        const decoded = jwt.decode(authToken);

        if (decoded === null) {
            res.status(401).send({
                ok: false,
                message: "No authorized!",
            });
            return;
        }
        const refreshResult = await jwt_util.refreshVerify(refreshToken, decoded.id);
        if (!authResult.ok && authResult.message === "jwt expired") {
            if (!refreshResult) {
                res.status(401).json({
                    ok: false,
                    message: "No authorized",
                });
            } else {
                const newAccesstoken = jwt_util.sign(decoded.id);
                res.status(200).json({
                    message: "issued accesstoken",
                    token: {
                        accessToken: newAccesstoken,
                        refreshToken,
                    },
                });
            }
        } else {
            res.status(400).json({
                ok: false,
                message: "Acess token is not expired!",
            });
        }
    } catch (error) {
        next(error);
    }
});

//  certification phone;
import twilio from "twilio";
router.get("/phone/:phone", verify.params(authPhoneSchema), async (req, res, next) => {
    let client = new twilio(configuration().twilio_accountsid, configuration().twilio_authtoken);

    let random_number = (min, max) => {
        let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return ranNum;
    };

    const numberSender = {
        sendNumber: async function (number) {
            const rd_number = await random_number(11111, 99999);
            client.messages.create({
                body: "MYPORT 회원가입 인증 번호를 입력해주세요 : " + rd_number,
                to: "+82" + number,
                from: "+19402456656",
            });
            return rd_number;
        },
    };

    try {
        const { phone } = req.params;
        const user_status = await user_service.exist_user({ phone });
        if (user_status || !phone) {
            res.status(400).json({
                message: "해당 번호를 이미 사용중이거나 번호를 제대로 입력해주세요",
            });
            return;
        }
        const random_number = await numberSender.sendNumber(phone);

        res.status(200).json({
            number: random_number,
        });
    } catch (error) {
        next(error);
    }
});

// send email
import nodemailer from "nodemailer";
router.get("/email/:email", verify.params(authEmailSchema), async (req, res, next) => {
    const secret = configuration().secret;
    const mailSender = {
        sendGmail: function (param) {
            let transporter = nodemailer.createTransport({
                host: "smtp.worksmobile.com",
                port: 587,
                auth: {
                    user: configuration().google_user,
                    pass: configuration().google_pass,
                },
            });

            let mailOptions = {
                from: process.env.GOOGLE_USER,
                to: param.toEmail,
                subject: param.subject,
                text: param.text,
            };

            transporter.sendMail(mailOptions);
            transporter.close();
            return;
        },
    };

    try {
        const { email } = req.params;
        const user = await user_service.get_user({ email });
        if (!user) {
            res.status(400).json({
                message: "해당 이메일이 존재하지 않습니다.",
            });
            return;
        }

        const token = jwt.sign({ id: user.id }, secret, {
            algorithm: "HS256",
            expiresIn: "300000",
        });

        let emailParam = {
            toEmail: email, // 수신할 이메일

            subject: "해당 링크를 5분내로 클릭해주세요.", // 메일 제목

            text: `https://myport.info/reset?authtoken=${token}`, // 메일 내용
        };

        mailSender.sendGmail(emailParam);

        res.status(200).json({
            message: "성공적으로 이메일을 보냈습니다.",
        });
    } catch (error) {
        next(error);
    }
});

// exist email
router.get("/email/exist/:email", verify.params(existEmailSchema), async (req, res, next) => {
    try {
        const { email } = req.params;
        const data = {
            email,
        };
        const user_status = await user_service.exist_user(data);
        if (user_status) {
            res.status(400).json({
                message: "해당 이메일이 이미 존재합니다.",
            });
            return;
        }

        res.status(200).json({
            message: "해당 이메일 사용가능합니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.put("/password", verify.body(changePasswordSchema), async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const token_result = jwt_util.verify(token);
        if (!token_result.ok) {
            if (token_result.message === "jwt expired") {
                res.status(400).json({
                    message: "토큰이 만료되었습니다.",
                });
                return;
            }
            res.status(400).json({
                message: "해당 token이 유효하지 않습니다.",
            });
            return;
        }
        const data = {
            _id: token_result.id,
        };

        const user = await user_service.get_user(data).exec();
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
            const hash_password = bcrypt.hashSync(password, 10);
            await user_service.user_find_update(token_result, hash_password);
            res.status(200).json({
                message: "비밀번호가 정상적으로 변경되었습니다.",
            });
            return;
        }
        res.status(400).json({
            message: "전과 동일한 비밀번호를 입력했습니다.",
        });
    } catch (error) {
        next(error);
    }
});

// user secession
router.delete("/:user_id", check_object_id, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await user_service.exist_user({ user_id });
        if (!user) {
            res.status(400).json({
                message: "해당 사용자가 존재하지 않습니다.",
            });
            return;
        }
        await user_service.user_delete(user_id);
        res.status(200).json({
            message: "success delete user",
        });
    } catch (error) {
        next(error);
    }
});
export default router;
