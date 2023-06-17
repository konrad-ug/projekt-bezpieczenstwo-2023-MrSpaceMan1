import express from "express";
import menu from "./routes/menu";
import orders from "./routes/orders";
import users from "./routes/user";
import summary from "./routes/summary";
import { driver } from "./infrastructure/db_initialisation";
import { initializeIdentityProvider } from "./infrastructure/initializeIdentityProvider";
const app = express();

const AUTH_PROVIDER = process.env.AUTH_PROVIDER;
const AUTH_PROVIDER_PORT = process.env.AUTH_PROVIDER_PORT;

initializeIdentityProvider({
  well_known_url: `http://${AUTH_PROVIDER}:${AUTH_PROVIDER_PORT}/realms/bezpieczenstwo/.well-known/openid-configuration`,
  client_id: "kiosk-service",
});

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
