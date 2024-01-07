import { v4 as uuid } from "uuid"

let defaultData = [
  {
    name: "Wake Up",
    completed: true,
    notes: "Ah, another auspicious day",
    subtasks: [
      {
        name: "Get out of bed",
        completed: true
      }
    ]
  },
  {
    name: "Learn about HTMX",
    completed: true,
    notes: "Seems like a nice framework to work with",
    subtasks: [
      {
        name: "Read some tutorials",
        completed: true
      },
      {
        name: "Watch some videos",
        completed: true
      },
      {
        name: "Try some examples",
        completed: true
      }
    ]
  },
  {
    name: "Stay Hydrated",
    completed: false,
    notes: "",
    subtasks: []
  },
  {
    name: "Make todo app",
    completed: true,
    notes: "Oh, express, it's been a while.. ",
    subtasks: [
      {
        name: "Remember how express works",
        completed: true
      },
      {
        name: "Try to make the App",
        completed: true
      },
      {
        name: "Pay overdue AWS bill",
        completed: true
      },
      {
        name: "Host on cheap server",
        completed: true
      }
    ]
  },
  {
    name: "Get Interview?",
    completed: false,
    notes: "I'd love to hear back!",
    subtasks: [
      {
        name: "Follow up",
        completed: false
      }
    ]
  }
]

// Befire exporting, let's just add id's for the right places
let todos = defaultData.map((item, i) => {
  return {
    ...item,
    id: uuid(),
    subtasks: item.subtasks.map((subtask) => {
      return {
        id: uuid(),
        ...subtask
      }
    })
  }
})

export default todos
