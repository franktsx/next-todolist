import { useRouter } from "next/router"
import { FormEvent, FormEventHandler, useRef } from "react"
import { Todo } from "../../utils/types"
import React from "react"

// Define props
interface CreateProps {
  url: string
}

// Define Component
function Create(props: CreateProps) {
  // get the next route
  const router = useRouter()

  // since there is just one input we will use a uncontrolled form
  const item = useRef<HTMLInputElement>(null)
  const priority = useRef<HTMLInputElement>(null)

  // Function to create new todo
  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    // construct new todo, create variable, check it item.current is not null to pass type checks
    let todo: Todo = { item: "", completed: false, priority: "" }
    if (null !== item.current && null !== priority.current) {
        todo = { item: item.current.value, completed: false, priority: priority.current.value }
    }

    // Make the API request
    await fetch(props.url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })

    // after api request, push back to main page
    router.push("/")
  }

  return (
    <div>
      <h1>Create a New Todo</h1>
      <form onSubmit={handleSubmit}>
        item*: <input type="text" ref={item}></input>
        priority*: <input type="number" ref={priority} min="1" max="5" ></input>
        <div>
            <input type="submit" value="create todo"></input>
        </div>
      </form>
    </div>
  )
}

// export getStaticProps to provie API_URL to component
export async function getStaticProps(context: any) {
  return {
    props: {
      url: process.env.API_URL,
    },
  }
}

// export component
export default Create