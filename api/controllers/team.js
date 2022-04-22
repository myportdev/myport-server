import { Router } from "express";
import team_service from "../services/team.js";
import auth_token from "../../middlewares/auth_token.js";
import { check_create_team_object_id, check_read_update_team_object_id } from "../../middlewares/objectid_valid.js";
import { team_image_upload } from "../../middlewares/uploads.js";
import { team_schema } from "../validations/team.js";
import validator from "express-joi-validation";

const router = Router();
const verify = validator.createValidator({});

router.post("/", auth_token, team_image_upload.single("image"), verify.body(team_schema), check_create_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const team_leader = await team_service.get_user(user_id);
        let contest;
        let extracurricular;
        if (req.body.relation_contest) {
            contest = await team_service.get_contest({ _id: req.body.relation_contest });
        } else if (req.body.relation_extracurricular) {
            extracurricular = await team_service.get_extracurricular({ _id: req.body.relation_extracurricular });
        }

        let team_image_url;
        if (req.file) {
            team_image_url = req.file.transforms[0].location;
        }

        const team_data = {
            ...req.body,
            team_leader,
            team_image_url,
            relation_contest: contest,
            relation_extracurricular: extracurricular,
        };
        const team = await team_service.create_team(team_data);
        res.status(201).json({
            team,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const user = await team_service.get_user(user_id);
        let team_leader_data = [];
        let team_members_data = [];
        let team_waiting_data = [];
        let teams_data = [];
        const [affiliated_team_leader, affiliated_team_members, waiting_for_support_team, teams] = await Promise.all([
            team_service.get_affiliated_team({ team_leader: user.id }),
            team_service.get_affiliated_team({ team_members: { $in: [user] } }),
            team_service.get_affiliated_team({ waiting_for_support: { $in: [user] } }),
            team_service.get_recruiting_list_team(user),
        ]);
        for (const team of affiliated_team_leader) {
            team_leader_data.push({
                _id: team.id,
                recruiting: team.recruiting,
                team_name: team.team_name,
                team_image_url: team.team_image_url ? team.team_image_url : "",
                relation_contest: team.relation_contest ? team.relation_contest : "",
                relation_extracurricular: team.relation_extracurricular ? team.relation_extracurricular : "",
                team_members: team.team_members,
                team_leader: team.team_leader,
                team_type: team.team_type,
            });
        }

        for (const team of affiliated_team_members) {
            team_members_data.push({
                _id: team.id,
                recruiting: team.recruiting,
                team_name: team.team_name,
                team_image_url: team.team_image_url,
                team_image_url: team.team_image_url ? team.team_image_url : "",
                relation_extracurricular: team.relation_extracurricular ? team.relation_extracurricular : "",
                relation_contest: team.relation_contest ? team.relation_contest : "",
                team_members: team.team_members,
                team_type: team.team_type,
            });
        }

        for (const team of waiting_for_support_team) {
            team_waiting_data.push({
                _id: team.id,
                recruiting: team.recruiting,
                team_name: team.team_name,
                team_image_url: team.team_image_url,
                team_image_url: team.team_image_url ? team.team_image_url : "",
                relation_contest: team.relation_contest ? team.relation_contest : "",
                relation_extracurricular: team.relation_extracurricular ? team.relation_extracurricular : "",
                team_members: team.team_members,
                team_type: team.team_type,
            });
        }

        for (const team of teams) {
            if (team && team.relation_contest) {
                const str_date = team.relation_contest.end_date;
                let d_day = date_difference(str_date);
                if (d_day < 0) {
                    continue;
                }
            } else if (team && team.relation_extracurricular) {
                const str_date = team.relation_extracurricular.end_date;
                let d_day = date_difference(str_date);
                if (d_day < 0) {
                    continue;
                }
            }
            teams_data.push({
                _id: team.id,
                recruiting: team.recruiting,
                team_name: team.team_name,
                team_image_url: team.team_image_url,
                team_image_url: team.team_image_url ? team.team_image_url : "",
                relation_contest: team.relation_contest ? team.relation_contest : "",
                relation_extracurricular: team.relation_extracurricular ? team.relation_extracurricular : "",
                team_members: team.team_members,
                team_type: team.team_type,
            });
        }

        res.status(200).json({
            team_leader: team_leader_data,
            team_members: team_members_data,
            team_waiting: team_waiting_data,
            teams: teams_data,
        });
    } catch (error) {
        next(error);
    }
});

import date_difference from "../../modules/date_difference.js";
router.get("/:team_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_detail_team({ _id: team_id });

        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }

        let contest_data;
        let extracurricular_data;
        if (team && team.relation_contest) {
            contest_data = { ...team.relation_contest._doc };
            const end_date = contest_data.end_date;
            const remaining_days = date_difference(end_date);
            contest_data.remaining_days = remaining_days;
        } else if (team && team.relation_extracurricular) {
            extracurricular_data = { ...team.relation_extracurricular._doc };
            const end_date = extracurricular_data.end_date;
            const remaining_days = date_difference(end_date);
            extracurricular_data.remaining_days = remaining_days;
        }

        let response_data = {
            relation_contest: contest_data,
            relation_extracurricular: extracurricular_data,
            team_name: team.team_name,
            short_explanation: team.short_explanation,
            detail_explanation: team.detail_explanation,
            recruitment_field: team.recruitment_field,
            team_members: team.team_members,
            team_members_boolean: false,
            team_leader: team.team_leader,
            team_leader_boolean: false,
            team_waiting_boolean: false,
            recruiting: team.recruiting,
        };
        if (user_id == team.team_leader._id) {
            response_data.waiting_for_support = team.waiting_for_support;
            response_data.team_leader_boolean = true;
        }
        if (team.team_members.find((member) => member.id == user_id)) {
            response_data.team_members_boolean = true;
        }
        if (team.waiting_for_support.find((user) => user.id == user_id)) {
            response_data.team_waiting_boolean = true;
        }
        res.status(200).json({
            team: response_data,
        });
    } catch (error) {
        next(error);
    }
});

import { delete_team_s3_object } from "../../modules/delete_s3.js";
router.put("/:team_id", auth_token, team_image_upload.single("image"), verify.body(team_schema), check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });

        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }

        if (team && team.team_leader._id == user_id) {
            let contest;
            let extracurricular;
            if (req.body.relation_contest) {
                contest = await team_service.get_contest({ _id: req.body.relation_contest });
            } else if (req.body.relation_extracurricular) {
                extracurricular = await team_service.get_extracurricular({ _id: req.body.relation_extracurricular });
            }

            const team_data = {
                ...req.body,
                relation_contest: contest,
                relation_extracurricular: extracurricular,
            };

            let team_image_url;
            if (req.file) {
                if (req.file.transforms[0].location != team.team_image_url) {
                    team_image_url = req.file.transforms[0].location;
                    team_data.team_image_url = team_image_url;

                    delete_team_s3_object(team.team_image_url);
                }
            } else {
                if (team.team_image_url) {
                    team_data.team_image_url = "";
                    delete_team_s3_object(team.team_image_url);
                }
            }
            const update_team = await team_service.update_team(team_id, team_data);
            res.status(200).json({
                team: update_team,
            });
            return;
        }
        res.status(400).json({
            message: "user is not a team leader",
        });
        return;
    } catch (error) {
        next(error);
    }
});

router.delete("/:team_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }
        if (team && team.team_leader._id == user_id) {
            await team_service.delete_team({ _id: team.id });
            res.status(200).json({
                message: "success delete team",
            });
            return;
        }
        res.status(400).json({
            message: "user is not a team leader",
        });
    } catch (error) {
        next(error);
    }
});
// 모집 마감 버튼 -> 모집중 column을 반전 시킴
router.put("/recruitment/:team_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }
        if (team && team.team_leader._id == user_id) {
            const update_team = await team_service.update_team(team._id, { recruiting: !team.recruiting });
            res.status(200).json({
                team: update_team,
            });
            return;
        }
        res.status(400).json({
            message: "user is not a team leader",
        });
    } catch (error) {
        next(error);
    }
});

router.put("/accept/:team_id/:member_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id, member_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }

        if (!team.waiting_for_support.includes(member_id)) {
            res.status(400).json({
                message: "member is a team member or have not applied to the team",
            });
            return;
        }

        if (team && team.team_leader._id == user_id) {
            await team_service.update_team(team.id, { $push: { team_members: member_id } });
            const update_team = await team_service.update_team(team.id, { $pull: { waiting_for_support: member_id } });
            await res.status(200).json({
                team: update_team,
            });
            return;
        }
        res.status(400).json({
            message: "user is not a team leader",
        });
    } catch (error) {
        next(error);
    }
});

router.put("/refuse/:team_id/:member_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id, member_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }

        if (!team.waiting_for_support.includes(member_id)) {
            res.status(400).json({
                message: "have not applied to the team",
            });
            return;
        }
        if (team && team.team_leader._id == user_id) {
            const update_team = await team_service.update_team(team_id, { $pull: { waiting_for_support: member_id } });
            res.status(200).json({
                team: update_team,
            });
            return;
        }
        res.status(400).json({
            message: "user is not a team leader",
        });
    } catch (error) {
        next(error);
    }
});

router.post("/apply/:team_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }
        if (team && team.team_leader._id == user_id) {
            res.status(400).json({
                message: "this user is the leader",
            });
            return;
        }
        if (team && team.team_members.includes(user_id)) {
            res.status(400).json({
                message: "user is a member",
            });
            return;
        }

        if (team && team.waiting_for_support.includes(user_id)) {
            res.status(400).json({
                message: "already applied",
            });
            return;
        }
        await team_service.update_team(team.id, { $push: { waiting_for_support: user_id } });
        res.status(200).json({
            team: "success apply",
        });
    } catch (error) {
        next(error);
    }
});

router.put("/secession/:team_id", auth_token, check_read_update_team_object_id, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;
        const { team_id } = req.params;
        const team = await team_service.get_team({ _id: team_id });
        if (!team) {
            res.status(400).json({
                message: "The team does not exist",
            });
            return;
        }
        if (team && team.team_leader._id == user_id) {
            res.status(400).json({
                message: "this user is the leader",
            });
            return;
        }

        if (team && team.team_members.includes(user_id)) {
            await team_service.update_team(team.id, { $pull: { team_members: user_id } });
            res.status(200).json({
                team: "success secession",
            });
            return;
        }

        res.status(400).json({
            message: "this user is not team member",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
