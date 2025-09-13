import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", (req, res) => res.send({ title: "CREATE New User" }));

userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE New User" }));

userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE New User" }));

export default userRouter;
