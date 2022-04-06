import User from "../../models/User.js";
import Interest from "../../models/Interest.js";
import University from "../../models/University.js";
import Profile from "../../models/Profile.js";
import Portfolio from "../../models/Portfolio.js";
import Project from "../../models/Project.js";
import Team from "../../models/Team.js";
const user_service = {
    get_user: async (data) => {
        let user;
        if (data._id) {
            user = await User.findById({ ...data }).exec();
            return user;
        }
        user = await User.findOne({ ...data }).exec();
        return user;
    },

    get_university: async () => {
        const university = await University.find().exec();
        return university;
    },

    exist_user: async (data) => {
        const user_status = await User.exists({ ...data });
        return user_status;
    },

    find_interest_array: async (interest_array) => {
        const interest_documents = await Interest.find().in("interest_name", interest_array);
        return interest_documents;
    },

    find_university: async (college, major) => {
        const university = await University.findOne({ university_name: college, major_name: major }).exec();
        return university;
    },

    create_user: async (data) => {
        const user = await User.create({
            ...data,
        });
        return user;
    },

    count_user: async () => {
        return await User.count();
    },

    find_update_user: async (user, hash_password) => {
        const update_user = await User.findByIdAndUpdate(user.id, { password: hash_password }).exec();
        return update_user;
    },

    delete_user: async (user_id) => {
        const delete_user = await User.findByIdAndDelete({ _id: user_id }).exec();
        return delete_user;
    },
    delete_profile: async (user_id) => {
        const profile = await Profile.findOneAndDelete({ user: user_id }).exec();
        return profile;
    },
    delete_portfolio: async (user_id) => {
        const portfolio = await Portfolio.findOneAndDelete({ user: user_id }).exec();
        return portfolio;
    },
    delete_project: async (portfolio_id) => {
        const project = await Project.findOneAndDelete({ user: portfolio_id }).exec();
        return project;
    },

    get_portfolio: async (user_id) => {
        const portfolio = await Portfolio.findOne({ user: user_id }).exec();
        return portfolio;
    },
    delete_user_team: async (user_id) => {
        // team_leader
        await Team.deleteMany({ team_leader: user_id });
        await Team.updateMany({
            $pull: { team_members: user_id },
        });
        await Team.updateMany({
            $pull: { waiting_for_support: user_id },
        });
        return;
    },
    exist_profile: async (data) => {
        const profile_status = await Profile.exists({ ...data });
        return profile_status;
    },
};

export default user_service;
