require("dotenv").config();
const uri = process.env.ATLAS_URI;
module.exports = {
    // url: "mongodb://localhost:27017/Reports_db",
    url: uri,
};
