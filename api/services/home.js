import Portfolio from "../../models/Portfolio.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import Contest from "../../models/Contest.js";
import Team from "../../models/Team.js";

const home_service = {
    get_user: async (user_id) => {
        const user = await User.findById({ _id: user_id }).exec();
        return user;
    },

    get_same_interest_user: async (user) => {
        let users = [];
        for (const index in user.interest) {
            users = users.concat(
                await User.find({ interest: { $in: [user.interest[index]] } })
                    .limit(10)
                    .select("name image_url_medium")
            );
        }
        const filter_users = users.filter((item1, index1) => {
            if (item1.id != user.id) {
                return (
                    users.findIndex((item2, index2) => {
                        return item1.id === item2.id;
                    }) === index1
                );
            }
        });
        return filter_users;
    },

    get_profile: async (user_id) => {
        const profile = await Profile.findOne({ user: user_id }).exec();
        return profile;
    },

    get_portfolio: async (user_id) => {
        const portfolio = await Portfolio.findOne({ user: user_id }).exec();
        return portfolio;
    },

    get_contests: async () => {
        const contests = await Contest.find().populate("relation_category", "interest_name").select("_id image_url_thumbnail title relation_category end_date founder").sort({ end_date: 1 }).exec();
        return contests;
    },

    get_recruiting_list_team: async (user) => {
        const team = await Team.find()
            .nor([{ team_leader: user }, { team_members: { $in: [user] } }, { waiting_for_support: { $in: [user] } }])
            .select("team_members relation_contest relation_extracurricular team_name team_type team_image_url recruiting")
            .populate({
                path: "relation_contest",
                select: "image_url_thumbnail title end_date",
            })
            .populate({
                path: "relation_extracurricular",
                select: "image_url_thumbnail title end_date",
            })
            .sort({ create_date: -1 })
            .exec();
        return team;
    },
};

export default home_service;
