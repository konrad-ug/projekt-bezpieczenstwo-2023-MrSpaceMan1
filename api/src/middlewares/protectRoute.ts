import { RequestHandler } from "express";
import { ReqWithToken } from "../types";

const protectRoute =
  (roles: String[]): RequestHandler =>
  (req: ReqWithToken, res, next) => {
    const { token } = req;

    if (!token) {
      return res.status(401).send("Access denied");
    }

    
  };
