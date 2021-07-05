import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "@f1blog/common";
import { ProfileCreatedListener } from "./events/listeners/profile-created-listener";
import { ProfileUpdatedListener } from "./events/listeners/profile-updated-listener";
import { ProfileDeletedListener } from "./events/listeners/profile-deleted-listener";
import { natsWrapper } from "./nats-wrapper";

// DB config
const db = require("./config/keys").mongoURI_team;

// Connect to Mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_Key not set");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ProfileCreatedListener(natsWrapper.client).listen();
    new ProfileUpdatedListener(natsWrapper.client).listen();
    new ProfileDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log("listening on 3000!!!");
  });
};

start();
