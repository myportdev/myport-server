import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teamSchema = Schema({
    team_name: {
        type: String,
    },
    user: [
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
    field: {
        type: String,
    },
    team_type: {
        type: String,
    },
    team_image_url: {
        type: String,
    },
    team_type: {
        type: Number,
    },
    gender: {
        type: String,
    },
});

export default mongoose.model("Team", teamSchema);
