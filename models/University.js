import mongoose from "mongoose";
const Schema = mongoose.Schema;

const universitySchema = Schema({
    university_name: {
        type: String,
    },
    major_name: {
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

export default mongoose.model("University", universitySchema);
