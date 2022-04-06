import { Router } from "express";
import { login_schema, refresh_schema, register_schema, auth_phone_schema, email_schema, change_password_schema, reset_password_schema } from "../validations/user.js";
import validator from "express-joi-validation";
import bcrypt from "bcryptjs";
import cache from "../../util/cache.js";
import jwt_util from "../../util/jwt_util.js";
import jwt from "jsonwebtoken";
import user_service from "../services/user.js";
import number_sender from "../../modules/number_sender.js";
import auth_token from "../../middlewares/auth_token.js";

const router = Router();
const verify = validator.createValidator({});

import moment from "moment";
import send_slack from "../../modules/send_slack.js";
import { profile_upload } from "../../middlewares/uploads.js";
router.post("/", profile_upload.single("image"), verify.body(register_schema), async (req, res, next) => {
    try {
        const { email, password, name, birth_date, phone_number, address, college, major, student_number, interest, gender, promotion } = req.body;
        const hash_password = bcrypt.hashSync(password, 10);

        const user_status = await user_service.exist_user({ email });
        if (user_status) {
            res.status(400).json({
                message: "the email exists",
            });
            return;
        }

        let interest_documents = [];
        if (interest) {
            const interest_array = interest.split(" ");
            interest_documents = await user_service.find_interest_array(interest_array);
        }

        const university = await user_service.find_university(college, major);

        let small_image = "";
        let large_image = "";
        let medium_image = "";
        if (req.file) {
            small_image = req.file.transforms.find(function (data, index) {
                return data.id == "Small";
            }).location;
            large_image = req.file.transforms.find(function (data, index) {
                return data.id == "Large";
            }).location;
            medium_image = req.file.transforms.find(function (data, index) {
                return data.id == "Medium";
            }).location;
        }
        const user_data = {
            email,
            name,
            birth_date,
            phone_number,
            address,
            university,
            student_number,
            gender,
            promotion,
            password: hash_password,
            interest: interest_documents,
            image_url_small: small_image,
            image_url_medium: large_image,
            image_url_large: medium_image,
        };
        const user = await user_service.create_user(user_data);

        const join_date = moment(user.join_date).format("YYYY-MM-DD hh:mm:ss");
        const total_user = await user_service.count_user();
        const join_data = await cache.get("today_join");

        await send_slack(user.name, join_date, user.phone_number, user.email, total_user, parseInt(join_data) + parseInt(1));
        await cache.set("today_join", parseInt(join_data) + parseInt(1));

        res.status(201).json({
            user_id: user.id,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/token", verify.body(login_schema), async (req, res, next) => {
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
router.post("/logout", auth_token, async (req, res, next) => {
    try {
        const { user_id } = res.locals;
        const user_status = await user_service.exist_user({ _id: user_id });
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

router.get("/refresh", verify.headers(refresh_schema), async (req, res, next) => {
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

router.get("/phone/:phone", verify.params(auth_phone_schema), async (req, res, next) => {
    try {
        const { phone } = req.params;
        const user_status = await user_service.exist_user({ phone_number: phone });
        if (user_status || !phone) {
            res.status(400).json({
                message: "the number is in use or please enter the number correctly",
            });
            return;
        }
        const random_number = await number_sender.send_number(phone);

        res.status(200).json({
            number: random_number,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/email/exist/:email", verify.params(email_schema), async (req, res, next) => {
    try {
        const { email } = req.params;
        const user_status = await user_service.exist_user({ email });
        if (user_status) {
            res.status(400).json({
                message: "the email exists",
            });
            return;
        }

        res.status(200).json({
            message: "the email is available",
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/password/reset", verify.body(reset_password_schema), async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const token_result = jwt_util.verify(token);
        if (!token_result.ok) {
            if (token_result.message === "jwt expired") {
                res.status(400).json({
                    message: "token Expiration",
                });
                return;
            }
            res.status(400).json({
                message: "token is not valid",
            });
            return;
        }

        const user = await user_service.get_user({ _id: token_result.id });
        if (!user) {
            res.status(400).json({
                message: "user doesn't exist",
            });
            return;
        }
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
            const hash_password = bcrypt.hashSync(password, 10);
            await user_service.find_update_user(token_result, hash_password);
            res.status(200).json({
                message: "password has been successfully changed",
            });
            return;
        }
        res.status(400).json({
            message: "you entered the same password",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/university", async (req, res, next) => {
    try {
        let university_data = await cache.get("university");
        if (!university_data) {
            const university = await user_service.get_university();
            let target_university = "";
            university_data = [];
            for (const index in university) {
                if (target_university == "") {
                    target_university = university[index].university_name;
                    university_data.push({ university_name: university[index].university_name, major_name: [university[index].major_name] });
                } else if (target_university == university[index].university_name) {
                    university_data[university_data.length - 1].major_name.push(university[index].major_name);
                } else if (target_university != university[index].university_name) {
                    target_university = university[index].university_name;
                    university_data.push({ university_name: university[index].university_name, major_name: [university[index].major_name] });
                }
            }
            await cache.set("university", JSON.stringify(university_data));
        } else {
            university_data = JSON.parse(university_data);
        }
        res.status(200).json({ university: university_data });
    } catch (error) {
        next(error);
    }
});

router.get("/find/email", async (req, res, next) => {
    const { name, birth_date } = req.query;
    const user = await user_service.get_user({ name, birth_date });
    if (!user) {
        res.status(400).json({
            message: "please enter your name or date of birth correctly",
        });
        return;
    }
    res.status(200).json({
        email: user.email,
    });
});

import mail_sender from "../../modules/mail_sender.js";
import configuration from "../../configuration.js";
router.get("/send/email/:email", verify.params(email_schema), async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await user_service.get_user({ email });
        if (!user) {
            res.status(400).json({
                message: "user doesn't exist",
            });
            return;
        }

        const secret = configuration().secret;
        const token = jwt.sign({ id: user.id }, secret, {
            algorithm: "HS256",
            expiresIn: "300000",
        });

        let email_param = {
            toEmail: email, // 수신할 이메일

            subject: "해당 링크를 5분내로 클릭해주세요.", // 메일 제목

            text: `https://myport.info/reset?authtoken=${token}`, // 메일 내용
        };

        mail_sender.send_mail(email_param);

        res.status(200).json({
            message: "success send email",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/join/email", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const user = await user_service.get_user({ _id: user_id });
        if (!user) {
            res.status(200).json({
                message: "해당 유저가 존재하지 않습니다.",
            });
        }
        const data = { email_account: user.email };
        res.status(200).json({
            data,
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/password/change", auth_token, verify.body(change_password_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { existing_password, new_password } = req.body;

        const user = await user_service.get_user({ _id: user_id });
        const result = bcrypt.compareSync(existing_password, user.password);
        if (result) {
            const hash_password = bcrypt.hashSync(new_password, 10);
            await user_service.find_update_user(user, hash_password);
            res.status(200).json({
                message: "password has been successfully changed",
            });
            return;
        }
        res.status(400).json({
            message: "please enter your password correctly",
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/secession", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const user = await user_service.exist_user({ _id: user_id });
        if (!user) {
            res.status(400).json({
                message: "user doesn't exist",
            });
            return;
        }
        if (await user_service.exist_profile({ user: user_id })) {
            await user_service.delete_profile(user_id);
        }
        const portfolio = await user_service.get_portfolio(user_id);
        if (portfolio) {
            await user_service.delete_project(portfolio.id);
            await user_service.delete_portfolio(user_id);
        }

        await user_service.delete_user_team(user_id);
        await user_service.delete_user(user_id);
        await cache.del(user_id);

        res.status(200).json({
            message: "success delete user",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
