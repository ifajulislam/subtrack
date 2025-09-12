import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) =>
  res.send({ message: "GET All Subscriptions" })
);

subscriptionRouter.get("/:id", (req, res) =>
  res.send({ message: "GET Subscription Details" })
);

subscriptionRouter.post("/", (req, res) =>
  res.send({ message: "CREATE Subscription" })
);

subscriptionRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATE Subscription" })
);

subscriptionRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETE Subscription" })
);

subscriptionRouter.get("/user/:id", (req, res) =>
  res.send({ message: "Get User All Subscription" })
);

subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({ message: "Cancel Subscription" })
);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ message: "GET Upcoming Subscription" })
);

export default subscriptionRouter;
