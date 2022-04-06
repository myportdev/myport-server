import mongoose from "mongoose";
const Schema = mongoose.Schema;

const interestSchema = Schema({
    interest_name: {
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

export default mongoose.model("Interest", interestSchema);
