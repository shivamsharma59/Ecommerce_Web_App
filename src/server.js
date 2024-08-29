const connectDb = require('../src/db/index.db.js');
const app = require('./app.js');

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on PORT no : ${process.env.PORT}`);
        })
    })
    .catch(() => {
        console.log("MongoDb Connection Failed !!");
    })