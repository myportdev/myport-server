import { Router } from "express";
import auth_token from "../../middlewares/auth_token.js";
import home_service from "../services/home.js";
import date_difference from "../../modules/date_difference.js";

const router = Router();

router.get("/", auth_token, async (req, res, next) => {
    try {
        const user_id = res.locals.user_id;

        const user = await home_service.get_user(user_id);
        const same_interest_users = await home_service.get_same_interest_user(user);

        const contests = await home_service.get_contests();
        let contests_data = [];
        if (contests) {
            for (const contest of contests) {
                const str_date = contest.end_date;
                let d_day = date_difference(str_date);
                if (d_day < 0) {
                    continue;
                }
                contests_data.push({
                    _id: contest.id,
                    image_url_thumbnail: contest.image_url_thumbnail,
                    title: contest.title,
                    dday: d_day,
                    relation_category: contest.relation_category,
                    founder: contest.founder ? contest.founder : "",
                });
            }
        }
        const teams = await home_service.get_recruiting_list_team(user);
        let teams_data = [];
        if (teams) {
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
        }

        const profile = await home_service.get_profile(user_id);
        const portfolio = await home_service.get_portfolio(user_id);

        res.status(200).json({
            users: same_interest_users,
            contests: contests_data.slice(0, 15),
            teams: teams_data.slice(0, 10),
            completion_rate: profile.completion_rate + portfolio.completion_rate,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
