import mongoose from "mongoose";
const Schema = mongoose.Schema;
const portfolioSchema = Schema({
    user: { ref: "User", type: Schema.Types.ObjectId },
    summaries: [
        {
            content: {
                type: String,
            },
        },
    ],
    education_careers: [
        {
            university: {
                type: Schema.Types.ObjectId,
                ref: "University",
            },
            admisstion_date: {
                type: String,
            },
            status: {
                type: String,
            },
            graduation_date: {
                type: String,
            },
        },
    ],
    duty_careers: [
        {
            company_name: {
                type: String,
            },
            department: {
                type: String,
            },
            position: {
                type: String,
            },
            start_date: {
                type: String,
            },
            end_date: {
                type: String,
            },
            description: {
                type: String,
            },
            status: {
                type: String,
            },
        },
    ],
    award_careers: [
        {
            title: {
                type: String,
            },
            award: {
                type: String,
            },
            award_date: {
                type: String,
            },
            description: {
                type: String,
            },
        },
    ],
    skills: [
        {
            title: {
                type: String,
            },
        },
    ],
    certificates: [
        {
            title: {
                type: String,
            },
        },
    ],
    certificates_of_completions: [
        {
            title: {
                type: String,
            },
        },
    ],
    completion_rate: {
        type: Number,
        default: 0,
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
    update_date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Portfolio", portfolioSchema);
