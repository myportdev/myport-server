import User from "../../models/User.js";
import Contest from "../../models/Contest.js";
import Extracurricular from "../../models/Extracurricular.js";

const activity_service = {
    // contest
    get_contests: async () => {
        const contests = await Contest.find()
            .populate("relation_category", "interest_name")
            .select("_id image_url_thumbnail category title relation_category end_date views likes founder")
            .sort({ end_date: 1 })
            .exec();
        return contests;
    },
    get_contest: async (contest_id) => {
        const contest = await Contest.findById(contest_id).populate("relation_category", "interest_name").exec();
        return contest;
    },
    delete_contest: async (contest_id) => {
        const contest = await Contest.findByIdAndDelete(contest_id).exec();
        return contest;
    },
    update_add_view_contest: async (contest_id, data) => {
        const update_contest = await Contest.findByIdAndUpdate(contest_id, { views: data.views + 1 }, { new: true }).exec();
        return update_contest;
    },
    update_add_likes_contest: async (contest_id) => {
        const update_contest = await Contest.findByIdAndUpdate(contest_id, { $inc: { likes: 1 } }, { new: true }).exec();
        return update_contest;
    },
    update_sub_likes_contest: async (contest_id) => {
        const update_contest = await Contest.findByIdAndUpdate(contest_id, { $inc: { likes: -1 } }, { new: true }).exec();
        return update_contest;
    },
    // extracurricular
    get_extracurriculars: async () => {
        const extracurriculars = await Extracurricular.find()
            .populate("relation_category", "interest_name")
            .select("_id image_url_thumbnail category title relation_category end_date views likes")
            .sort({ end_date: 1 })
            .exec();
        return extracurriculars;
    },
    get_extracurricular: async (extracurricular_id) => {
        const extracurricular = await Extracurricular.findById(extracurricular_id).populate("relation_category", "interest_name").exec();
        return extracurricular;
    },
    delete_extracurricular: async (extracurricular_id) => {
        const extracurricular = await Extracurricular.findByIdAndDelete(extracurricular_id).exec();
        return extracurricular;
    },
    update_add_view_extracurricular: async (extracurricular_id, data) => {
        const update_extracurricular = await Extracurricular.findByIdAndUpdate(extracurricular_id, { views: data.views + 1 }, { new: true }).exec();
        return update_extracurricular;
    },
    update_add_likes_extracurricular: async (extracurricular_id) => {
        const update_extracurricular = await Extracurricular.findByIdAndUpdate(extracurricular_id, { $inc: { likes: 1 } }, { new: true }).exec();
        return update_extracurricular;
    },
    update_sub_likes_extracurricular: async (extracurricular_id) => {
        const update_extracurricular = await Extracurricular.findByIdAndUpdate(extracurricular_id, { $inc: { likes: -1 } }, { new: true }).exec();
        return update_extracurricular;
    },

    get_user: async (user_id) => {
        const user = await User.findById(user_id).exec();
        return user;
    },

    delete_user_interest_contest: async (user_id, contest_id) => {
        const user = await User.findByIdAndUpdate(user_id, { $pull: { interest_contest: contest_id } }, { new: true }).exec();
        return user;
    },
    delete_user_interest_extracurricular: async (user_id, extracurricular_id) => {
        const user = await User.findByIdAndUpdate(user_id, { $pull: { interest_extracurricular: extracurricular_id } }, { new: true }).exec();
        return user;
    },
};

export default activity_service;
