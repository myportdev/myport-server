import Profile from "../../models/Profile.js";
import Portfolio from "../../models/Portfolio.js";
import Project from "../../models/Project.js";
import User from "../../models/User.js";
import University from "../../models/University.js";
const profile_service = {
    // user
    get_user: async (user_id) => {
        const user = await User.findById({ _id: user_id }).exec();
        return user;
    },
    update_user: async (user_id, data) => {
        const user = await User.findByIdAndUpdate(user_id, { ...data }, { new: true }).exec();
        return user;
    },
    update_profile_image: async (user_id, data) => {
        const user = await User.findByIdAndUpdate(
            user_id,
            {
                ...data,
            },
            { new: true }
        ).exec();
        return user;
    },
    // profile
    get_profile: async (data) => {
        const profile = await Profile.findOne({ ...data })
            .populate({
                path: "user",
                select: "name image_url_small image_url_medium image_url_large",
                populate: {
                    path: "university",
                },
            })
            .exec();
        return profile;
    },
    exist_profile: async (data) => {
        const status = await Profile.exists({ ...data });
        return status;
    },
    create_profile: async (data) => {
        const profile = await new Profile({ ...data });
        await profile.save();
        return profile;
    },
    update_profile: async (user_id, data) => {
        const profile = await Profile.findOneAndUpdate(
            {
                user: user_id,
            },
            {
                ...data,
            },
            {
                new: true,
            }
        ).exec();
        return profile;
    },
    delete_profile: async (data) => {
        const profile = await Profile.findByIdAndDelete({ ...data }).exec();
        return profile;
    },

    // portfolio
    get_portfolio: async (data) => {
        const portfolio = await Portfolio.findOne({ ...data }).exec();
        return portfolio;
    },
    exist_portfolio: async (data) => {
        const status = await Portfolio.exists({ ...data });
        return status;
    },
    create_portfolio: async (data) => {
        const portfolio = await new Portfolio({ ...data });
        await portfolio.save();
        return portfolio;
    },
    update_portfolio: async (user_id, data) => {
        const portfolio = await Portfolio.findOneAndUpdate(
            {
                user: user_id,
            },
            {
                ...data,
            },
            {
                new: true,
            }
        )
            .populate({
                path: "education_careers",
                populate: {
                    path: "university",
                },
            })
            .exec();
        return portfolio;
    },

    // project
    get_projects: async (data) => {
        const project = await Project.find({ ...data }).exec();
        return project;
    },
    get_project: async (data) => {
        const project = await Project.findById({ ...data }).exec();
        return project;
    },
    create_project: async (data) => {
        const project = await new Project({
            ...data,
        });
        await project.save();
        return project;
    },
    update_project: async (project_id, data) => {
        const project = await Project.findByIdAndUpdate(
            project_id,
            {
                team_name: "",
                start_date: "",
                end_date: "",
                status: "",
                contents: "",
                ...data,
            },
            { new: true }
        ).exec();
        return project;
    },

    delete_project: async (project_id) => {
        const project = await Project.findByIdAndDelete(project_id).exec();
        return project;
    },
    // university
    get_university: async (data) => {
        const university = await University.findOne({ ...data }).exec();
        return university;
    },
};

export default profile_service;
