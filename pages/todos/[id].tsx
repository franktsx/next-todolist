import { Todo } from "../../utils/types"
import { useRouter } from "next/router"
import { useState } from "react"

// Define Prop Interface
interface ShowProps {
  todo: Todo
  url: string
}

// Define Component
function Show(props: ShowProps) {
  // get the next router, so we can use router.push later
  const router = useRouter()

  // set the todo as state for modification
  const [todo, setTodo] = useState<Todo>(props.todo)

  const [itemname, setItemname] = useState(todo.item);
  const [itempriority, setItempriority] = useState(todo.priority);

  // function to complete a todo
  const handleComplete = async () => {
    if (!todo.completed) {
      // make copy of todo with completed set to true
      const newTodo: Todo = { ...todo, completed: true }
      // make api call to change completed in database
      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        // send copy of todo with property
        body: JSON.stringify(newTodo),
      })
      // once data is updated update state so ui matches without needed to refresh
      setTodo(newTodo)
    }
    // if completed is already true this function won't do anything
  }

  const handleIncomplete = async () => {
    if (todo.completed) {
      // make copy of todo with completed set to true
      const newTodo: Todo = { ...todo, completed: false }
      // make api call to change completed in database
      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        // send copy of todo with property
        body: JSON.stringify(newTodo),
      })
      // once data is updated update state so ui matches without needed to refresh
      setTodo(newTodo)
    }
    // if completed is already true this function won't do anything
  }

  // function for handling clicking the delete button
  const handleDelete = async () => {
    await fetch(props.url + "/" + todo._id, {
      method: "delete",
    })
    //push user back to main page after deleting
    router.push("/")
  }

  const handleNameUpdate = async () => {
      const newTodo: Todo = { ...todo, item: itemname }
      // make api call to change completed in database
      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        // send copy of todo with property
        body: JSON.stringify(newTodo),
      })
      // once data is updated update state so ui matches without needed to refresh
      setTodo(newTodo)
      alert("Item name updated")
  }

  const handlePrioUpdate = async () => {
      const newTodo: Todo = { ...todo, priority: itempriority }
      // make api call to change completed in database
      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        // send copy of todo with property
        body: JSON.stringify(newTodo),
      })
      // once data is updated update state so ui matches without needed to refresh
      setTodo(newTodo)
      alert("Item priority updated")
  } 

  //return
  return (
    <div>
      <div>
        Item name: 
        <input value={itemname} onChange={e => setItemname(e.target.value)}></input>
        <button onClick={handleNameUpdate}>Update Name</button>
      </div>
      <div>
        Priority: 
        <input value={itempriority} onChange={e => setItempriority(e.target.value)}></input>
        <button onClick={handlePrioUpdate}>Update Priority</button>
      </div>
      <div>
        Status: {todo.completed ? "completed" : "incomplete"}
      </div>
      <div>
        <button onClick={handleComplete}>Complete</button>
        <button onClick={handleIncomplete}>Incomplete</button>
        <button onClick={handleDelete}>Delete</button>
        <button
          onClick={() => {
            router.push("/")
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

// Define Server Side Props
export async function getServerSideProps(context: any) {
  // fetch the todo, the param was received via context.query.id
  const res = await fetch(process.env.API_URL + "/" + context.query.id)
  const todo = await res.json()

  //return the serverSideProps the todo and the url from out env variables for frontend api calls
  return { props: { todo, url: process.env.API_URL } }
}

// export component
export default Show