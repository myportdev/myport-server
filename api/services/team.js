import Team from "../../models/Team.js";
import User from "../../models/User.js";
import Contest from "../../models/Contest.js";
import Extracurricular from "../../models/Extracurricular.js";

const team_service = {
    create_team: async (data) => {
        const team = await new Team({ ...data });
        team.save();
        return team;
    },
    get_user: async (user_id) => {
        const user = await User.findById({ _id: user_id }).exec();
        return user;
    },
    find_contest: async (data) => {
        const contest = await Contest.findById({ ...data }).exec();
        return contest;
    },
    find_extracurricular: async (data) => {
        const extracurricular = await Extracurricular.findById({ ...data }).exec();
        return extracurricular;
    },
    find_affiliated_team: async (data) => {
        const team = await Team.find({ ...data })
            .select("team_members relation_contest relation_extracurricular team_name team_type team_image_url recruiting")
            .populate({
                path: "relation_contest",
                select: "image_url_thumbnail title",
            })
            .populate({
                path: "relation_extracurricular",
                select: "image_url_thumbnail title",
            })
            .sort({ create_date: -1 })
            .exec();
        return team;
    },
    find_recruiting_list_team: async (user) => {
        const team = await Team.find()
            .nor([{ team_leader: user }, { team_members: { $in: [user] } }, { waiting_for_support: { $in: [user] } }])
            .select("team_members relation_contest relation_extracurricular team_name team_type team_image_url recruiting")
            .populate({
                path: "relation_contest",
                select: "image_url_thumbnail title",
            })
            .populate({
                path: "relation_extracurricular",
                select: "image_url_thumbnail title",
            })
            .sort({ create_date: -1 })
            .exec();
        return team;
    },
    find_detail_team: async (data) => {
        const team = await Team.findById({ ...data })
            .populate({
                path: "team_leader",
                select: "id name image_url_medium",
            })
            .populate({
                path: "team_members",
                select: "id name image_url_medium",
            })
            .populate({
                path: "waiting_for_support",
                select: "id name image_url_medium",
            })
            .populate({
                path: "relation_contest",
                select: "id title end_date",
            })
            .populate({
                path: "relation_extracurricular",
                select: "id title end_date",
            })
            .exec();
        return team;
    },
    delete_team: async (data) => {
        const team = await Team.findByIdAndDelete({ ...data }).exec();
        return team;
    },
    update_team: async (team_id, data) => {
        const team = await Team.findByIdAndUpdate(team_id, { ...data }, { new: true }).exec();
        return team;
    },
    get_team: async (data) => {
        const team = await Team.findOne({ ...data }).exec();
        return team;
    },
};

export default team_service;
