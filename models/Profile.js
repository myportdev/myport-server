import mongoose from "mongoose";
const Schema = mongoose.Schema;
const profileSchema = Schema({
    user: { ref: "User", type: Schema.Types.ObjectId },
    short_introdution: {
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
});

export default mongoose.model("Profile", profileSchema);
