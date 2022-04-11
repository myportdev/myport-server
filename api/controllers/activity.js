import { Router } from "express";
import auth_token from "../../middlewares/auth_token.js";
import activity_service from "../services/activity.js";
import date_difference from "../../modules/date_difference.js";

const router = Router();

router.get("/contests", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const contests = await activity_service.get_contests();
        const response_contests = [];
        const user = await activity_service.get_user(user_id);

        for (const contest of contests) {
            const str_date = contest.end_date;
            let d_day = date_difference(str_date);

            let interest_boolean = false;

            for (const user_contest of user.interest_contest) {
                if (contest._id.equals(user_contest._id)) {
                    interest_boolean = true;
                }
            }

            response_contests.push({
                _id: contest._id,
                image_url_thumbnail: contest.image_url_thumbnail,
                category: contest.category,
                title: contest.title,
                relation_category: contest.relation_category,
                view: contest.views,
                like: contest.likes,
                interest: interest_boolean,
                dday: d_day,
                founder: contest.founder ? contest.founder : "",
            });
        }

        res.status(200).json({
            contests: response_contests,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/extracurriculars", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const extracurriculars = await activity_service.get_extracurriculars();
        const response_extracurriculars = [];
        const user = await activity_service.get_user(user_id);
        for (const extracurricular of extracurriculars) {
            const str_date = extracurricular.end_date;
            let d_day = date_difference(str_date);
            let interest_boolean = false;

            for (const user_extracurricular of user.interest_extracurricular) {
                if (extracurricular._id.equals(user_extracurricular._id)) {
                    interest_boolean = true;
                }
            }

            response_extracurriculars.push({
                _id: extracurricular._id,
                image_url_thumbnail: extracurricular.image_url_thumbnail,
                category: extracurricular.category,
                title: extracurricular.title,
                relation_category: extracurricular.relation_category,
                view: extracurricular.views,
                like: extracurricular.likes,
                interest: interest_boolean,
                dday: d_day,
                founder: extracurricular.founder ? extracurricular.founder : "",
            });
        }

        res.status(200).json({
            extracurriculars: response_extracurriculars,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/contest/:contest_id", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { contest_id } = req.params;
        const contest = await activity_service.get_contest(contest_id);
        if (contest) {
            const user = await activity_service.get_user(user_id);

            const update_contest = await activity_service.update_add_view_contest(contest_id, contest);

            const str_date = contest.end_date;
            let dday = date_difference(str_date);

            let interest_boolean = false;
            if (user.interest_contest.includes(contest.id)) {
                interest_boolean = true;
            }

            const response_contest = {
                id: contest.id,
                image_url_thumbnail: contest.image_url_thumbnail,
                image_url_introduction: contest.image_url_introduction,
                category: contest.category,
                title: contest.title,
                start_date: contest.start_date,
                end_date: contest.end_date,
                topic: contest.topic,
                eligibility: contest.eligibility,
                awards: contest.awards,
                detail_information: contest.detail_information,
                site_url: contest.site_url,
                support_url: contest.support_url,
                company_type: contest.company_type,
                location: contest.location,
                relation_category: contest.relation_category,
                view: update_contest.views,
                dday: dday,
                interest: interest_boolean,
                like: contest.likes,
                founder: contest.founder ? contest.founder : "",
            };
            res.status(200).json({ contest: response_contest });
            return;
        }
        res.status(400).json({
            message: "contest doesn't exist",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/extracurricular/:extracurricular_id", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { extracurricular_id } = req.params;
        const extracurricular = await activity_service.get_extracurricular(extracurricular_id);
        if (extracurricular) {
            const user = await activity_service.get_user(user_id);

            const update_extracurricular = await activity_service.update_add_view_extracurricular(extracurricular_id, extracurricular);

            const str_date = extracurricular.end_date;
            let dday = date_difference(str_date);

            let interest_boolean = false;
            if (user.interest_extracurricular.includes(extracurricular.id)) {
                interest_boolean = true;
            }
            const response_extracurricular = {
                id: extracurricular.id,
                image_url_thumbnail: extracurricular.image_url_thumbnail,
                image_url_introduction: extracurricular.image_url_introduction,
                category: extracurricular.category,
                title: extracurricular.title,
                start_date: extracurricular.start_date,
                end_date: extracurricular.end_date,
                benefits: extracurricular.benefits,
                eligibility: extracurricular.eligibility,
                activities: extracurricular.activities,
                detail_information: extracurricular.detail_information,
                site_url: extracurricular.site_url,
                support_url: extracurricular.support_url,
                location: extracurricular.location,
                relation_category: extracurricular.relation_category,
                view: update_extracurricular.views,
                dday: dday,
                interest: interest_boolean,
                like: extracurricular.likes,
                founder: extracurricular.founder ? extracurricular.founder : "",
            };

            res.status(200).json({ extracurricular: response_extracurricular });
            return;
        }
        res.status(400).json({
            message: "extracurricular doesn't exist",
        });
    } catch (error) {
        next(error);
    }
});

import { check_activity_push_bookmark_object_id } from "../../middlewares/objectid_valid.js";
router.post("/contest/interest", auth_token, check_activity_push_bookmark_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { contest_id } = req.body;
        const [user, contest] = await Promise.all([activity_service.get_user(user_id), activity_service.get_contest(contest_id)]);
        if (!contest) {
            res.status(400).json({
                message: "contest doesn't exist",
            });
            return;
        }

        if (user.interest_contest.includes(contest_id)) {
            res.status(400).json({
                message: "contest exists in the user's interest contest",
            });
            return;
        }

        user.interest_contest.push({ _id: contest_id });
        user.save();
        await activity_service.update_add_likes_contest(contest_id);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

router.post("/extracurricular/interest", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { extracurricular_id } = req.body;
        const [user, extracurricular] = await Promise.all([activity_service.get_user(user_id), activity_service.get_extracurricular(extracurricular_id)]);
        if (!extracurricular) {
            res.status(400).json({
                message: "extracurricular doesn't exist",
            });
            return;
        }

        if (user.interest_extracurricular.includes(extracurricular_id)) {
            res.status(400).json({
                message: "extracurricular exists in the user's interest extracurricular",
            });
            return;
        }

        user.interest_extracurricular.push({ _id: extracurricular_id });
        user.save();
        await activity_service.update_add_likes_extracurricular(extracurricular_id);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

import { check_activity_pop_bookmark_object_id } from "../../middlewares/objectid_valid.js";
router.delete("/contest/interest/:contest_id", auth_token, check_activity_pop_bookmark_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { contest_id } = req.params;

        const user = await activity_service.get_user(user_id);
        if (user.interest_contest.includes(contest_id)) {
            const index = await user.interest_contest.findIndex((item) => item._id == contest_id);
            user.interest_contest.splice(index, 1);
            user.save();
            await activity_service.update_sub_likes_contest(contest_id);
            res.status(200).json({ user });
            return;
        }
        res.status(400).json({
            message: "contest doesn't exist",
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/extracurricular/interest/:extracurricular_id", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { extracurricular_id } = req.params;

        const user = await activity_service.get_user(user_id);
        if (user.interest_extracurricular.includes(extracurricular_id)) {
            const index = await user.interest_extracurricular.findIndex((item) => item._id == extracurricular_id);
            user.interest_extracurricular.splice(index, 1);
            user.save();
            await activity_service.update_sub_likes_extracurricular(extracurricular_id);
            res.status(200).json({ user });
            return;
        }
        res.status(400).json({
            message: "extracurricular doesn't exist",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
