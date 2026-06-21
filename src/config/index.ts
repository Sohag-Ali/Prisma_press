import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    app_url: process.env.APP_URL || "http://localhost:5000",
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET || "your_access_secret_here",
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret_here",
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};