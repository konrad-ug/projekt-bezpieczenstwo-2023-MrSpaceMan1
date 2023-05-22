import { Router } from "express";
import addUser from "../repository/users/addUser";

const users = Router();

users.post("/", async (req, res) => {
  const { phone_number, isAdmin } = req.body;
  addUser(phone_number, isAdmin)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

export default users;
