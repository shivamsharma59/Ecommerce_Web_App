const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`);
        console.log(`MongoDb connected !! on host : ${connectionInstance.connection.host}`);
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDb;