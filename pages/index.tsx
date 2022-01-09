import React, { useState, useEffect, useMemo } from "react"
import { Todo } from "../utils/types"
import Link from "next/link"

// Define the components props
interface IndexProps {
  todos: Array<Todo>
}

// define the page component
function Index(props: IndexProps) {

  const { todos } = props

  const [filteredResults, setFilteredResults] = useState(todos);

  const searchItems = (e: string) => {
      if (e !== '') {
        const filteredData = todos.filter((item) => {
          return Object.values(item).join('').toLowerCase().includes(e.toLowerCase())
        })
        setFilteredResults(filteredData)
      }else{
        setFilteredResults(todos)
      }
  }

  const sortItems = (todos: Todo[]): Todo[] => {
    return todos.sort((i1, i2) => parseInt(i1.priority) - parseInt(i2.priority));
  };

  const sortedItem = sortItems(filteredResults);
  return (
    <div> 
      <h1>My Todo List</h1>
      <h2>Click On Todo to see it individually and editing</h2>
      <Link href="/todos/create"><button>Create a New Todo</button></Link>
      {/* MAPPING OVER THE TODOS */}
      <div className="header">
        <input
          onInput={(e) => searchItems(e.target.value)}
          type="text"
          placeholder="Search by item name..."
        />
      </div>
      {sortedItem.map(t => (
        <div key={`${t.item}_${t.priority}`}>
          <Link href={`/todos/${t._id}`}>
            <h3 style={{ cursor: "pointer" }}>
              {t.item} - {t.completed ? "completed" : "incomplete"} -  priority: {t.priority}
            </h3>
          </Link>
        </div>
      ))}
    </div>
  )
}

// GET PROPS FOR SERVER SIDE RENDERING
export async function getServerSideProps() {
  // get todo data from API
  const res = await fetch(process.env.API_URL as string)
  const todos = await res.json()

  // return props
  return {
    props: { todos },
  }
}

export default Index