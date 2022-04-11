import { Router } from "express";
import auth_token from "../../middlewares/auth_token.js";
import validator from "express-joi-validation";
import profile_service from "../services/profile.js";
import { project_schema } from "../validations/profile.js";
import { check_user_object_id, check_project_object_id } from "../../middlewares/objectid_valid.js";

const router = Router();
const verify = validator.createValidator({});

router.get("/my", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const profile = await profile_service.get_profile({ user: user_id });

        if (profile) {
            if (profile.sns) {
                for (const item of profile.sns) {
                    if (!item.url) {
                        item.url = "";
                    }
                }
            }
            const profile_data = {
                introdution: "",
                status: "",
                interest_job: "",
                ...profile._doc,
            };
            res.status(200).json({
                profile: profile_data,
            });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 프로필이 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:user_id", auth_token, check_user_object_id, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        if (user_id === res.locals.user_id) {
            res.status(400).json({
                message: "you are logged in user",
            });
            return;
        }
        const profile = await profile_service.get_profile({ user: user_id });
        if (profile) {
            const profile_data = {
                introdution: "",
                status: "",
                interest_job: "",
                ...profile._doc,
            };
            res.status(200).json({
                profile: profile_data,
            });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 프로필이 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio/my", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (portfolio) {
            for (const education of portfolio.education_careers) {
                if (!education.graduation_date) {
                    education.graduation_date = "";
                }
            }
            for (const duty of portfolio.duty_careers) {
                if (!duty.department) {
                    duty.department = "";
                }
                if (!duty.position) {
                    duty.position = "";
                }
                if (!duty.start_date) {
                    duty.start_date = "";
                }
                if (!duty.end_date) {
                    duty.end_date = "";
                }
                if (!duty.description) {
                    duty.description = "";
                }
            }

            for (const award of portfolio.award_careers) {
                if (!award.award) {
                    award.award = "";
                }
                if (!award.award_date) {
                    award.award_date = "";
                }
                if (!award.description) {
                    award.description = "";
                }
            }

            res.status(200).json({ portfolio });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio/:user_id", auth_token, check_user_object_id, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        if (user_id === res.locals.user_id) {
            res.status(400).json({
                message: "you are logged in user",
            });
            return;
        }
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (portfolio) {
            for (const education of portfolio.education_careers) {
                if (!education.graduation_date) {
                    education.graduation_date = "";
                }
            }
            for (const duty of portfolio.duty_careers) {
                if (!duty.department) {
                    duty.department = "";
                }
                if (!duty.position) {
                    duty.position = "";
                }
                if (!duty.start_date) {
                    duty.start_date = "";
                }
                if (!duty.end_date) {
                    duty.end_date = "";
                }
                if (!duty.description) {
                    duty.description = "";
                }
            }

            for (const award of portfolio.award_careers) {
                if (!award.award) {
                    award.award = "";
                }
                if (!award.award_date) {
                    award.award_date = "";
                }
                if (!award.description) {
                    award.description = "";
                }
            }

            res.status(200).json({ portfolio });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio/projects/my", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        if (user_id === res.locals.user_id) {
            res.status(400).json({
                message: "you are logged in user",
            });
            return;
        }
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        const projects = await profile_service.get_projects({ portfolio: portfolio.id });
        if (portfolio) {
            for (const project of projects) {
                if (!project.project_image_url_thumbnail) {
                    project.project_image_url_thumbnail = "";
                }
                if (!project.title) {
                    project.title = "";
                }
            }
            res.status(200).json({ projects });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio/projects/:user_id", auth_token, check_user_object_id, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        const projects = await profile_service.get_projects({ portfolio: portfolio.id });
        if (portfolio) {
            for (const project of projects) {
                if (!project.project_image_url_thumbnail) {
                    project.project_image_url_thumbnail = "";
                }
                if (!project.title) {
                    project.title = "";
                }
            }
            res.status(200).json({ projects });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio/project/:project_id", auth_token, check_project_object_id, async (req, res, next) => {
    try {
        const { project_id } = req.params;
        const project = await profile_service.get_project({ _id: project_id });
        if (!project) {
            res.status(400).json({
                message: "해당 프로젝트가 존재하지 않습니다.",
            });
        }
        const project_data = {
            project_image_url_thubnail: "",
            title: "",
            team_name: "",
            start_date: "",
            end_date: "",
            contents: "",
            status: "",
            project_url: "",
            ...project._doc,
        };
        res.status(200).json({ project: project_data });
    } catch (error) {
        next(error);
    }
});

router.post("/:user_id", async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const profile_status = await profile_service.exist_profile({ user: user_id });
        if (!profile_status) {
            const profile = await profile_service.create_profile({ user: user_id });
            res.status(201).json({ profile });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 프로필이 이미 존재합니다.",
        });
    } catch (error) {
        next(error);
    }
});

router.post("/portfolio/:user_id", async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const portfolio_status = await profile_service.exist_portfolio({ user: user_id });
        if (!portfolio_status) {
            const portfolio = await profile_service.create_portfolio({ user: user_id });
            portfolio.save();
            res.status(201).json({ portfolio });
            return;
        }
        res.status(400).json({
            message: "해당 유저의 포트폴리오가 이미 존재합니다.",
        });
    } catch (error) {
        next(error);
    }
});

import { project_image_upload } from "../../middlewares/uploads.js";
router.post(
    "/portfolio/project/my",
    auth_token,
    verify.body(project_schema),
    project_image_upload.fields([
        { name: "introdution", maxCount: 1 },
        { name: "contents", maxCount: 3 },
    ]),
    async (req, res, next) => {
        try {
            const user_id = res.locals.user_id;
            const project_data = {
                ...req.body,
            };
            const portfolio = await profile_service.get_portfolio({ user: user_id });
            if (!portfolio) {
                res.status(400).json({
                    message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
                });
            }

            const project_image_url_contents = [];
            if (req.files && req.files.introdution) {
                project_data.project_image_url_thumbnail = req.files.introdution[0].transforms[0].location;
            }
            if (req.files && req.files.contents) {
                for (const image of req.files.contents) {
                    project_image_url_contents.push(image.transforms[0].location);
                }
                project_data.project_image_url_contents = project_image_url_contents;
            }
            project_data.user = user_id;
            const project = await profile_service.create_project({ ...project_data, portfolio });

            res.status(200).json({
                project,
            });
        } catch (error) {
            next(error);
        }
    }
);

import { profile_upload } from "../../middlewares/uploads.js";
import { delete_profile_s3_object } from "../../modules/delete_s3.js";
import { update_profile_schema } from "../validations/profile.js";
router.put("/my", auth_token, verify.body(update_profile_schema), profile_upload.single("image"), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const profile_status = await profile_service.exist_profile({ user: user_id });
        if (!profile_status) {
            res.status(400).json({
                message: "해당 유저의 프로필이 존재하지 않습니다.",
            });
            return;
        }

        const find_user = await profile_service.get_user(user_id);
        if (find_user.image_url_small !== undefined && find_user.image_url_small !== "") {
            const image_small_key = find_user.image_url_small.split("/");
            const image_medium_key = find_user.image_url_medium.split("/");
            const image_large_key = find_user.image_url_large.split("/");
            delete_profile_s3_object(image_large_key, image_medium_key, image_small_key);
        }

        let image_url_small = "";
        let image_url_large = "";
        let image_url_medium = "";
        if (req.file) {
            image_url_small = req.file.transforms.find(function (data, index) {
                return data.id == "Small";
            }).location;
            image_url_large = req.file.transforms.find(function (data, index) {
                return data.id == "Large";
            }).location;
            image_url_medium = req.file.transforms.find(function (data, index) {
                return data.id == "Medium";
            }).location;
            await profile_service.update_profile_image(user_id, {
                image_url_small,
                image_url_medium,
                image_url_large,
            });
        }

        if (req.body.user) {
            const university = await profile_service.get_university({ university_name: req.body.user.college, major_name: req.body.user.major });
            await profile_service.update_user(user_id, { name: req.body.user.name, university: university.id });
        }

        let profile;
        if (req.body.profile) {
            let completion_rate = 0;
            if (req.body.profile.status) {
                completion_rate += 5;
            }
            if (req.body.profile.introdution) {
                completion_rate += 20;
            }
            if (req.body.profile.interest_job) {
                completion_rate += 10;
            }
            if (req.body.profile.sns && req.body.profile.sns.length) {
                completion_rate += 5;
            }
            profile = await profile_service.update_profile(user_id, { ...req.body.profile, completion_rate });
        }
        res.status(200).json({
            profile,
        });
    } catch (error) {
        next(error);
    }
});

import { update_summury_schema } from "../validations/profile.js";
router.put("/portfolio/summury/my", auth_token, verify.body(update_summury_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }

        let completion_rate = 0;
        if (portfolio.summaries.length !== 0) {
            if (req.body.summury && req.body.summury.length === 0) {
                completion_rate = -30;
            }
        } else {
            if (req.body.summury && req.body.summury.length !== 0) {
                completion_rate = 30;
            }
        }

        const update_portfolio = await profile_service.update_portfolio(user_id, { summaries: req.body.summury, completion_rate: portfolio.completion_rate + completion_rate });

        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { update_portfolio_education_schema } from "../validations/profile.js";
router.put("/portfolio/education/my", verify.body(update_portfolio_education_schema), auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }
        const educations_data = [];
        for (const education of req.body.education) {
            let university = await profile_service.get_university({ university_name: education.college, major_name: education.major });
            educations_data.push({
                university,
                admisstion_date: education.admisstion_date,
                status: education.status,
                graduation_date: education.graduation_date,
            });
        }
        let completion_rate = 0;
        if (portfolio.education_careers.length !== 0) {
            if (educations_data && educations_data.length === 0) {
                completion_rate = -10;
            }
        } else {
            if (educations_data && educations_data.length !== 0) {
                completion_rate = 10;
            }
        }
        const update_portfolio = await profile_service.update_portfolio(user_id, { education_careers: educations_data, completion_rate: portfolio.completion_rate + completion_rate });
        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { update_portfolio_duty_schema } from "../validations/profile.js";
router.put("/portfolio/duty/my", auth_token, verify.body(update_portfolio_duty_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }
        let completion_rate = 0;
        if (portfolio.duty_careers.length !== 0) {
            if (req.body.duty && req.body.duty.length === 0) {
                completion_rate = -1;
            }
        } else {
            if (req.body.duty && req.body.duty.length !== 0) {
                completion_rate = 1;
            }
        }

        const update_portfolio = await profile_service.update_portfolio(user_id, { duty_careers: req.body.duty, completion_rate: portfolio.completion_rate + completion_rate });

        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { update_portfolio_award_schema } from "../validations/profile.js";
router.put("/portfolio/award/my", auth_token, verify.body(update_portfolio_award_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }

        let completion_rate = 0;
        if (portfolio.award_careers.length !== 0) {
            if (req.body.award && req.body.award.length === 0) {
                completion_rate = -2;
            }
        } else {
            if (req.body.award && req.body.award.length !== 0) {
                completion_rate = 2;
            }
        }

        const update_portfolio = await profile_service.update_portfolio(user_id, { award_careers: req.body.award, completion_rate: portfolio.completion_rate + completion_rate });

        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { update_skill_schema } from "../validations/profile.js";
router.put("/portfolio/skill/my", auth_token, verify.body(update_skill_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }

        let completion_rate = 0;
        if (portfolio.skills.length !== 0) {
            if (req.body.skill && req.body.skill.length === 0) {
                completion_rate = -10;
            }
        } else {
            if (req.body.skill && req.body.skill.length !== 0) {
                completion_rate = 10;
            }
        }

        const update_portfolio = await profile_service.update_portfolio(user_id, { skills: req.body.skill, completion_rate: portfolio.completion_rate + completion_rate });

        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { update_certificate_schema } from "../validations/profile.js";
router.put("/portfolio/certificate/my", auth_token, verify.body(update_certificate_schema), async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const portfolio = await profile_service.get_portfolio({ user: user_id });
        if (!portfolio) {
            res.status(400).json({
                message: "해당 유저의 포트폴리오가 존재하지 않습니다.",
            });
        }
        let completion_rate = 0;
        if (portfolio.certificates.length + portfolio.certificates_of_completions.length !== 0) {
            if ((req.body.certificate || req.body.certificates_of_completion) && req.body.certificate.length + req.body.certificate_of_completion.length === 0) {
                completion_rate = -2;
            }
        } else {
            if ((req.body.certificate || req.body.certificates_of_completion) && req.body.certificate.length + req.body.certificate_of_completion.length !== 0) {
                completion_rate = 2;
            }
        }

        const update_portfolio = await profile_service.update_portfolio(user_id, {
            certificates: req.body.certificate,
            certificates_of_completions: req.body.certificate_of_completion,
            completion_rate: portfolio.completion_rate + completion_rate,
        });

        res.status(200).json({
            portfolio: update_portfolio,
        });
    } catch (error) {
        next(error);
    }
});

import { delete_project_s3_object } from "../../modules/delete_s3.js";
router.put(
    "/portfolio/project/my/:project_id",
    auth_token,
    verify.body(project_schema),
    project_image_upload.fields([
        { name: "introdution", maxCount: 1 },
        { name: "contents", maxCount: 3 },
    ]),
    async (req, res, next) => {
        try {
            const { project_id } = req.params;
            const project = await profile_service.get_project({ _id: project_id });
            if (!project) {
                res.status(400).json({
                    message: "해당 프로젝트가 존재하지 않습니다.",
                });
                return;
            }
            const project_data = {
                ...req.body,
            };
            const project_image_url_contents = [];
            if (project.project_image_url_thumbnail) {
                const project_image_key = project.project_image_url_thumbnail.split("/");
                delete_project_s3_object(project_image_key);
            }
            if (project.project_image_url_contents.length !== 0) {
                for (const location of project.project_image_url_contents) {
                    const project_image_key = location.split("/");
                    delete_project_s3_object(project_image_key);
                }
            }
            if (req.files) {
                const { introdution, contents } = req.files;
                if (introdution !== undefined) {
                    project_data.project_image_url_thumbnail = req.files.introdution[0].transforms[0].location;
                }
                if (contents !== undefined) {
                    for (const image of req.files.contents) {
                        project_image_url_contents.push(image.transforms[0].location);
                    }
                    project_data.project_image_url_contents = project_image_url_contents;
                }
            }
            const update_project = await profile_service.update_project(project_id, project_data);
            res.status(200).json({
                project: update_project,
            });
            return;
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/portfolio/project/my/:project_id", auth_token, async (req, res, next) => {
    try {
        const { project_id } = req.params;
        const project = await profile_service.get_project({ _id: project_id });
        if (project) {
            if (project.project_image_url_thumbnail) {
                const project_image_key = project.project_image_url_thumbnail.split("/");
                delete_project_s3_object(project_image_key);
            }
            if (project.project_image_url_contents.length !== 0) {
                for (const location of project.project_image_url_contents) {
                    const project_image_key = location.split("/");
                    delete_project_s3_object(project_image_key);
                }
            }
            const delete_project = await profile_service.delete_project(project_id);
            res.status(200).json({
                project: delete_project,
            });
            return;
        }

        res.status(400).json({
            message: "해당 프로젝트가 존재하지 않습니다.",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
