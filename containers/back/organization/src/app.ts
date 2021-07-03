import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@f1blog/common";

// Routes
import { organization } from "./routes/api/organization/organization";

const app = express();

app.use(json());

// Use routes
app.use("/api/v1/organization", organization);
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
