import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teamSchema = Schema({
    team_name: {
        type: String,
    },
    team_leader: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    team_members: [
        {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
    ],
    waiting_for_support: [
        {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
    ],
    short_explanation: {
        type: String,
    },
    detail_explanation: {
        type: String,
    },
    recruitment_field: {
        type: String,
    },
    team_type: {
        type: String,
    },
    team_image_url: {
        type: String,
    },
    gender: {
        type: String,
    },
    relation_contest: {
        type: Schema.Types.ObjectId,
        ref: "Contest",
    },
    relation_extracurricular: {
        type: Schema.Types.ObjectId,
        ref: "Extracurricular",
    },
    recruiting: {
        type: Boolean,
        default: true,
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

export default mongoose.model("Team", teamSchema);
