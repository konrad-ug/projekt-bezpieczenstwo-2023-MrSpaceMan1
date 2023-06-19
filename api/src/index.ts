import express from "express";
import menu from "./routes/menu";
import orders from "./routes/orders";
import users from "./routes/user";
import summary from "./routes/summary";
import { driver } from "./infrastructure/db_initialisation";
import { initializeIdentityProvider } from "./infrastructure/initializeIdentityProvider";
import cors from "cors";
import protectRoute from "./middlewares/protectRoute";
import { captureAccessToken } from "./middlewares/captureAccessToken";
const app = express();

try {
  driver.session().run(`
CREATE (c1:Category {id: "0ab08f42-55b8-488a-b680-6f6278f55e5e", name: "Meats"})-[:IN]->(m:Menu)<-[:IN]-(c2:Category {id: "0ab08f42-55b8-488a-b680-6f6278f55e5e", name: "Burgers"})
CREATE (i1:Item {id: "ad76ab97-4005-4f5c-a924-61040cb35a0c", name: "Strips", price: 7.99})-[:IN]->(c1)  
CREATE (i2:Item {id: "6959bbbb-bdbd-4cb2-ba09-fe2654bb3bfc", name: "Big Mak", price: 4.99})-[:IN]->(c2)
CREATE (u:User {id: "7a099d48-5b1f-4e57-b8fe-ad34ad2c202e"})`);
} catch {}

initializeIdentityProvider({
  well_known_url: `http://localhost:8080/realms/bezpieczenstwo/.well-known/openid-configuration`,
  client_id: "kiosk-service",
  client_secret: "cyqLjBcve3Zw2VWNwOB7UVUKeHEBAx8F",
});

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(captureAccessToken());

app.use("/api/menu", menu);
app.use("/api/orders", protectRoute(), orders);
app.use("/api/users", protectRoute(["Admin"]), users);
app.use("/api/summary", protectRoute(["Admin"]), summary);

driver.getServerInfo();
app.listen(3000, () => {
  console.log("Listening on localhost:3000");
});
