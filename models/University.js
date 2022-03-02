import mongoose from "mongoose";
const Schema = mongoose.Schema;

const universitySchema = Schema({
    university_name: {
        type: String,
    },
    major_name: {
        type: String,
    },
});

export default mongoose.model("University", universitySchema);
