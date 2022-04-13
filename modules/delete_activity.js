import activity_service from "../api/services/activity.js";
import date_difference from "./date_difference.js";

const delete_contest = async () => {
    const contests = await activity_service.get_contests();
    const users = await activity_service.get_users();
    for (const contest of contests) {
        const str_date = contest.end_date;
        let d_day = date_difference(str_date);
        console.log(d_day);
        if (d_day < 0) {
            for (const user of users) {
                if (user.interest_contest.includes(contest.id)) {
                    await activity_service.delete_user_interest_contest(user.id, contest.id);
                }
            }
            const relation_contest_teams = await activity_service.get_team_relation_contest(contest.id);
            if (!relation_contest_teams.length) {
                console.log("삭제완료");
                await activity_service.delete_contest(contest.id);
            }
        }
    }
    return;
};

const delete_extracurricular = async (extracurricular_id) => {
    const extracurriculars = await activity_service.get_extracurriculars();
    const users = await activity_service.get_users();
    for (const extracurricular of extracurriculars) {
        const str_date = extracurricular.end_date;
        let d_day = date_difference(str_date);
        if (d_day < 0) {
            for (const user of users) {
                if (user.interest_extracurricular.includes(extracurricular.id)) {
                    await activity_service.delete_user_interest_extracurricular(user.id, extracurricular.id);
                }
            }
            const relation_extracurricular_teams = await activity_service.get_team_relation_extracurricular(extracurricular.id);
            console.log(relation_extracurricular_teams.length);
            if (!relation_extracurricular_teams.length) {
                await activity_service.delete_extracurricular(extracurricular.id);
            }
        }
    }
    return;
};
export { delete_contest, delete_extracurricular };
