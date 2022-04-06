import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = Schema({
    portfolio: { ref: "Portfolio", type: Schema.Types.ObjectId },
    project_image_url_thumbnail: {
        type: String,
    },
    project_image_url_contents: [
        {
            type: String,
        },
    ],
    title: {
        type: String,
    },
    team_name: {
        type: String,
    },
    start_date: {
        type: String,
    },
    end_date: {
        type: String,
    },
    status: {
        type: String,
    },
    contents: {
        type: String,
    },
    project_url: {
        type: String,
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

export default mongoose.model("Project", projectSchema);
