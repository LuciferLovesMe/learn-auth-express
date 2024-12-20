import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
// import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";

dotenv.config();

// (async () => {
//   await db.sync();
// })();

const app = express();
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:300",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("server oke");
});
