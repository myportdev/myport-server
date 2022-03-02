import mongoose from "mongoose";
import configuration from "../configuration.js";

const connect = () => {
    mongoose
        .connect(configuration().database_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("myport databases connected..."))
        .catch((err) => console.log("error" + err));
};

export default connect;
