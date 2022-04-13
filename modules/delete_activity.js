<<<<<<< HEAD
const delete_activity = async (contest_id, user_id) => {
    await activity_service.delete_user_interest_contest(user_id, contest_id);
    await activity_service.delete_contest(contest_id);

    await activity_service.delete_user_interest_extracurricular(user_id);
    await activity_service.delete_extracurricular(extracurricular_id);
};
export default delete_activity;
=======
import activity_service from "../api/services/activity.js";

const delete_contest = async (contest_id) => {
    const users = await activity_service.get_users();
    for (const user of users) {
        if (user.interest_contest.includes(contest_id)) {
            await activity_service.delete_user_interest_contest(user.id, contest_id);
        }
    }
    const relation_contest_teams = await activity_service.get_team_relation_contest(contest_id);
    if (!relation_contest_teams.length) {
        await activity_service.delete_contest(contest_id);
    }
    return;
};

const delete_extracurricular = async (extracurricular_id) => {
    const users = await activity_service.get_users();
    for (const user of users) {
        if (user.interest_extracurricular.includes(extracurricular_id)) {
            await activity_service.delete_user_interest_extracurriculart(user.id, extracurricular_id);
        }
    }
    const relation_extracurricular_teams = await activity_service.get_team_relation_extracurricular(extracurricular_id);
    if (!relation_extracurricular_teams.length) {
        await activity_service.delete_extracurricular(extracurricular_id);
    }
    return;
};
export { delete_contest, delete_extracurricular };
>>>>>>> feature/activity
