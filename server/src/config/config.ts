import dotenv from "dotenv";
dotenv.config();
export const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.jhypi.mongodb.net/mydb?retryWrites=true&w=majority`;
