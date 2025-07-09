import "reflect-metadata";
import './services/redis.service'
import { AppDataSource } from "./database/data-source";
import app from "./app";
import { port } from "./secret";


AppDataSource.initialize()
  .then(() => {
    console.log("db connected");
    app.listen(port, () => {
      console.log("server is up");
    });
  })
  .catch((error) => console.log(error));
