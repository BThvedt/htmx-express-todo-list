import { Router } from "express"
import { v4 as uuid } from "uuid"
import renderFile from "../lib/renderFile.js"
import { __dirname } from "../app.js"

const router = Router()

router.get("/todo/:id", (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params

  const todo = todos.find((todo) => todo.id == id)

  res.render("pages/edit", {
    todo,
    compltedSubtasks: todo.subtasks.filter((subtask) => subtask.completed)
      .length
  })
})

router.post("/todos", async (req, res) => {
  const todos = req.app.get("todos")
  const { name } = req.body

  const newToDo = {
    id: uuid(),
    name,
    completed: false,
    notes: "",
    subtasks: []
  }

  todos.push(newToDo)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/index/todo.ejs`,
    {
      todo: newToDo,
      compltedSubtasks: 0
    }
  )

  res.status(201).send(responseHTML)
})

// On the todo-edit page, I was trying to figure out how to update multiple parts
// I do like the framework but I can see why wone wouldn't wanna do this a lot
// The header on the edit form in my desigh seems to require both
//  a patch and a get..and an hx - trigger when a subtask is updated..
router.patch("/todo/:id/completed/edit-header", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params
  const { completed } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id == id)
  const todo = todos[todoIndex]

  let todoCompleted = completed == "true" ? false : true

  const newToDo = {
    ...todo,
    completed: todoCompleted
  }

  todos.splice(todoIndex, 1, newToDo)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/edit-form-header.ejs`,
    {
      todo: newToDo,
      compltedSubtasks: todo.subtasks.filter((subtask) => subtask.completed)
        .length
    }
  )

  res.status(200).send(responseHTML)
})

// this is just for getting a new "header" part on the edit form
// (the part that says if the task is done)
// this can be triggered by a subtask update
router.get("/todo/:id/edit-header", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params

  const todo = todos.find((todo) => todo.id == id)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/edit-form-header.ejs`,
    {
      todo,
      compltedSubtasks: todo.subtasks.filter((subtask) => subtask.completed)
        .length
    }
  )

  res.status(200).send(responseHTML)
})

// I try several ways of editing fields
// this route returns a rendered form to edit the name field
// the HTMLX replaces the displayed name field with a form for editing
router.get("/todo/:id/editNameForm", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params

  const todo = todos.find((todo) => todo.id == id)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/edit-name-form.ejs`,
    {
      todo
    }
  )

  res.status(200).send(responseHTML)
})

// then the form in turn allows editing the name
// and then when dones, gets replaced with the origional name
router.patch("/todo/:id/name", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params
  const { name } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id == id)
  const todo = todos[todoIndex]

  const newToDo = {
    ...todo,
    name
  }

  todos.splice(todoIndex, 1, newToDo)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/todo-name.ejs`,
    {
      todo: newToDo
    }
  )

  res.status(201).send(responseHTML)
})

// another way I tried is just editing a textarea on input change
// with a 500ms delay to the request. Although all this route
// does is update this field, HTMX seems to want a response to continue
// triggering the change when necessary, even if it's just an empty string
router.patch("/todo/:id/notes", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params
  const { notes } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id == id)
  const todo = todos[todoIndex]

  const newToDo = {
    ...todo,
    notes
  }

  todos.splice(todoIndex, 1, newToDo)

  res.status(201).send("")
})

// Finally, this just marks a checkbox completed
// don't forget that it comes in as text
router.patch("/todo/:id/completed", async (req, res) => {
  const todos = req.app.get("todos")
  const { id } = req.params
  const { completed } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id == id)
  const todo = todos[todoIndex]

  let todoCompleted = completed == "true" ? false : true

  const newToDo = {
    ...todo,
    completed: todoCompleted
  }

  todos.splice(todoIndex, 1, newToDo)

  let responseHTML = await renderFile(
    `${__dirname}/views/partials/index/todo.ejs`,
    {
      todo: newToDo,
      compltedSubtasks: todo.subtasks.filter((subtask) => subtask.completed)
        .length
    }
  )

  res.send(responseHTML)
})

router.delete("/todo/:id", (req, res) => {
  let todos = req.app.get("todos")
  const { id } = req.params

  todos = todos.filter((todo) => todo.id != id)

  req.app.set("todos", todos) // whoop! Gotta reset the reference here

  // new at this framework.. sending an empty string seems to work best for now
  res.status(200).send("")
})

// finally.. a few subtask routes
router.post("/todo/:id/subtask", async (req, res) => {
  const todos = req.app.get("todos")
  let { id } = req.params

  const todo = todos.find((todo) => todo.id == id)
  const { subtasks } = todo
  let { name } = req.body

  const newSubTask = {
    id: uuid(),
    name,
    completed: false
  }

  todo.subtasks.push(newSubTask)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/subtask.ejs`,
    {
      subtask: newSubTask,
      todoId: id
    }
  )

  res.set("HX-Trigger", "subtaskUpdated").status(201).send(responseHTML)
})

router.patch("/todo/:id/subtask/:subtaskId", async (req, res) => {
  const todos = req.app.get("todos")
  const { id, subtaskId } = req.params
  const { completed } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id == id)
  const todo = todos[todoIndex]

  const subtaskCompleted = completed == "true" ? false : true

  const subtaskIndex = todo.subtasks.findIndex(
    (subtask) => subtask.id == subtaskId
  )
  const subtask = todo.subtasks[subtaskIndex]

  const newSubtask = {
    ...subtask,
    completed: subtaskCompleted
  }

  todo.subtasks.splice(subtaskIndex, 1, newSubtask)

  const responseHTML = await renderFile(
    `${__dirname}/views/partials/edit/subtask.ejs`,
    {
      subtask: newSubtask,
      todoId: id
    }
  )

  res.set("HX-Trigger", "subtaskUpdated").status(201).send(responseHTML)
})

// I was experimeting around a lot and I think I've learned
// that

router.delete("/todo/:id/subtask/:subtaskId", async (req, res) => {
  const todos = req.app.get("todos")
  let { id, subtaskId } = req.params

  const todo = todos.find((todo) => todo.id == id)
  let { subtasks } = todo
  subtasks = subtasks.filter((subtask) => subtask.id != subtaskId)

  todo.subtasks = subtasks

  res.set("HX-Trigger", "subtaskUpdated").status(200).send("") // sending an empty string seems to work best
})

export default router
