import mongoose from "mongoose";
const Schema = mongoose.Schema;

const certificateSchema = Schema({
    portfolio: { ref: "Portfolio", type: Schema.Types.ObjectId },
    title: {
        type: String,
    },
    acquisition_year: {
        type: String,
    },
    designation: {
        type: String,
    },
    certified: {
        type: Boolean,
    },
});

export default mongoose.model("Certificate", certificateSchema);
