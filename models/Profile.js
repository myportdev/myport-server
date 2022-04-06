import mongoose from "mongoose";
const Schema = mongoose.Schema;
const profileSchema = Schema({
    user: { ref: "User", type: Schema.Types.ObjectId },
    introdution: {
        type: String,
    },
    status: {
        type: String,
    },
    interest_job: {
        type: String,
    },
    sns: [
        {
            title: {
                type: String,
            },
            url: {
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

export default mongoose.model("Profile", profileSchema);
