import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = Schema({
    portfolio: { ref: "Portfolio", type: Schema.Types.ObjectId },
    project_image_url: {
        type: String,
    },
    title: {
        type: String,
    },
    agency: {
        type: String,
    },
    start_date: {
        type: String,
    },
    end_date: {
        type: String,
    },
    proceeding: {
        type: Boolean,
    },
    contents: {
        type: String,
    },
    project_url: [
        {
            url: {
                type: String,
            },
        },
    ],
});

export default mongoose.model("Project", projectSchema);
