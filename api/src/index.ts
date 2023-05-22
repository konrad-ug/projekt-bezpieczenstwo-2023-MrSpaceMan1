import express from "express";
import menu from "./routes/menu";
import orders from "./routes/orders";
import users from "./routes/user";
import summary from "./routes/summary";
import { driver } from "./infrastructure/db_initialisation";
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api/menu", menu);
app.use("/api/orders", orders);
app.use("/api/users", users);
app.use("/api/summary", summary);

driver.getServerInfo();
app.listen(3000, () => {
  console.log("Listening on localhost:3000");
});
