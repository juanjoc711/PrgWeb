import dotenv from "dotenv";

dotenv.config();

const constants = {
    jwtSecret: process.env.JWT_SECRET || "",
    mongoURI: process.env.MONGO_URI || ""
};

export default constants;
  