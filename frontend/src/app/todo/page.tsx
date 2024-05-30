"use client";
import { SetStateAction, useEffect, useState } from "react";
import TodoItem from "../../components/TodoItem";

//Add API base
const API_BASE = "http://localhost:4001/todo";

function Page() {
  //Add useState, we ll store items in the array
  const [items, setItems] = useState([]);
  // Add input state, we will store the user's input in this state
  const [input, setInput] = useState("");
  //Add useEffect, GetTodos() will run every time the component renders
  useEffect(() => {
    GetTodos();
  }, []);
  // Store the target's value into the input state
  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setInput(e.target.value);
  };
  // Add GetTodos() function, fetches data from our API, converts to JSON
  // and then saves the data in the 'items' state
  // If there's an error, it will be logged to the console
  const GetTodos = () => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  };

  const addItem = async () => {
    if (input.trim() === "") {
      return;
    }
    const data = await fetch(API_BASE + "/new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: input,
      }),
    }).then((res) => res.json());
    await GetTodos();
    setInput("");
  };

  return (
    <div className="container">
      <div className="heading">
        <h1 className="text-red-500">TO-DO-APP</h1>
      </div>

      <div className="form mt-4 flex items-center justify-center">
  <input
    type="text"
    value={input}
    onChange={handleChange}
    className="py-2 px-4 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    placeholder="Enter task..."
  />
  <button
    onClick={addItem}
    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    ADD
  </button>
</div>


      <div className="todolist mt-8">
        {items.map((item: { _id: string; name: string }) => (
          <TodoItem
            key={item._id}
            name={item.name}
            id={item._id}
            setItems={setItems}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
