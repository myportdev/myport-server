import User from "../../models/User.js";
import Interest from "../../models/Interest.js";
import University from "../../models/University.js";
const user_service = {
    get_user: async (data) => {
        let user;
        if (data.user_id) {
            user = await User.findById({ ...data }).exec();
            return user;
        }
        user = await User.findOne({ ...data }).exec();
        return user;
    },

    exist_user: async (data) => {
        const user_status = await User.exists({ ...data });
        return user_status;
    },

    find_interest_array: async (interest_array, next) => {
        const interest_documents = await Interest.find().where("name").in(interest_array).exec();
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

    user_count: async () => {
        return await User.count();
    },

    user_find_update: async (token_result, hash_password) => {
        await User.findByIdAndUpdate(token_result.id, { password: hash_password }).exec();
    },

    user_delete: async (user_id) => {
        await User.findByIdAndDelete({ _id: user_id }).exec();
        return true;
    },
};

export default user_service;
