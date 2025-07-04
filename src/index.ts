import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import app from "./app";

const port = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("db connected");
    app.listen(port, () => {
      console.log("server is up");
    });
  })
  .catch((error) => console.log(error));
