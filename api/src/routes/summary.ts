import { Router } from "express";
import { getMostCommonItems, getSummary } from "../repository";

const summary = Router();

summary
  .post("/", async (req, res) => {
    const { date } = req.body;

    if (!date) return res.status(400).send("Bad body");

    getSummary(date)
      .then((success) => {
        res.send(success.at(0));
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .get("/mostCommon", async (req, res) => {
    getMostCommonItems()
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.send(err));
  });

export default summary;
