import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import userRouter from "./routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json()); // to make sure json works with it
app.use(express.urlencoded({ extended: false })); // helps process form data sent by html forms in a simple format
app.use(cookieParser()); // this one reads cookies from incoming requests

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Subtrack is running");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectToDatabase();
});

export default app;
