import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contestSchema = Schema({
    image_url_thumbnail: {
        type: String,
    },
    image_url_introduction: {
        type: String,
    },
    category: {
        type: String,
    },
    title: {
        type: String,
    },
    start_date: {
        type: String,
    },
    end_date: {
        type: String,
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
    },
    site_url: {
        type: String,
    },
    support_url: {
        type: String,
    },
    location: {
        type: String,
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
    create_date: {
        type: Date,
        default: Date.now,
    },
    update_date: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model("Contest", contestSchema);
