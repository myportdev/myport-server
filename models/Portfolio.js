import mongoose from "mongoose";
const Schema = mongoose.Schema;
const portfolioSchema = Schema({
    summary: [
        {
            content: {
                type: String,
            },
        },
    ],
    user: { ref: "User", type: Schema.Types.ObjectId },
    duty_career: [
        {
            company: {
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
            job_description: {
                type: String,
            },
        },
    ],
    award_career: [
        {
            title: {
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
        },
    ],

    skills: [
        {
            title: {
                type: String,
            },
        },
    ],
});

export default mongoose.model("Portfolio", portfolioSchema);
