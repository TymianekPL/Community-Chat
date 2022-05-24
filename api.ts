import { Router } from "express";

const APIRouter = Router();

APIRouter.get("/", (req, res) => {
     res.json({
          message: "Hello World",
     });
});

export default APIRouter;
