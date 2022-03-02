import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
    image_url: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    birth_date: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    address: {
        type: String,
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
    },
    student_number: {
        type: String,
    },
    gender: {
        type: String,
    },
    interest_contest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
        },
    ],
    interest_extracurricular: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Extracurricular",
        },
    ],
    interest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interest",
        },
    ],
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    promotion: {
        type: Boolean,
    },

    join_date: {
        type: String,
    },
});

export default mongoose.model("User", userSchema);
