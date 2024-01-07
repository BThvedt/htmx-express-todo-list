import express from "express"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import defaultData from "./defaultData.js"
import router from "./routes/todo.js"

const app = express()
export const __dirname = dirname(fileURLToPath(import.meta.url))

app.set("view engine", "ejs")
app.set("views", [`${__dirname}/views`])
app.set("todos", defaultData)

app.use(express.urlencoded({ extended: false }))
app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
app.use("/", router)

export default app
