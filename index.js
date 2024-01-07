import app from "./app.js"
import { __dirname } from "./app.js"

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  const todos = req.app.get("todos")

  res.render("pages/index", {
    todos
  })
})

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`)
})
