const delete_activity = async (contest_id, user_id) => {
    await activity_service.delete_user_interest_contest(user_id, contest_id);
    await activity_service.delete_contest(contest_id);

    await activity_service.delete_user_interest_extracurricular(user_id);
    await activity_service.delete_extracurricular(extracurricular_id);
};
export default delete_activity;
