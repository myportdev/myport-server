import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contestSchema = Schema({
    image_url: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
    },
    eligibility: {
        type: String,
    },
    awards: {
        type: String,
    },
    detail_information: {
        type: String,
        required: true,
    },
    site_url: {
        type: String,
        required: true,
    },
    support_url: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    founder: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    relation_category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interest",
        },
    ],
});
export default mongoose.model("Contest", contestSchema);
