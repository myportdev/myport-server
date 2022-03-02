import mongoose from "mongoose";
const Schema = mongoose.Schema;

const interestSchema = Schema({
    interest_name: {
        type: String,
    },
});

export default mongoose.model("Interest", interestSchema);
