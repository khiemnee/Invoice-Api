import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "phamduykhiem2911",
    database: "invoice",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: [],
    subscribers: [],
})

