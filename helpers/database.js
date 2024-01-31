import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => console.log('MongoDB: conected ...'))
    .catch((err) => console.log(err.message));
