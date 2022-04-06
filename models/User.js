import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
    image_url_small: {
        type: String,
    },
    image_url_medium: {
        type: String,
    },
    image_url_large: {
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
        type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref: "Contest",
        },
    ],
    interest_extracurricular: [
        {
            type: Schema.Types.ObjectId,
            ref: "Extracurricular",
        },
    ],
    interest: [
        {
            type: Schema.Types.ObjectId,
            ref: "Interest",
        },
    ],
    team: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    promotion: {
        type: Boolean,
    },

    join_date: {
        type: Date,
        default: Date.now,
    },

    update_date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);
