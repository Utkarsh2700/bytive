"use client";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

// export interface Task {
//   userId: number;
//   id: number;
//   title: string;
//   completed: boolean;
// }

// export interface Todos {
//   localTodos: Task[];
// }

const Edit = () => {
  const router = useRouter();
  const params = useParams();
  // console.log("params", params.id);

  const {
    value: todos,
    loading,
    error,
  } = useAppSelector((state) => state.todo);

  const local = localStorage.getItem("todos") ?? "";
  const localTodos = JSON.parse(local);

  const [updateTodo] = todos.filter((todo) => todo.id == Number(params.id));
  // console.log("updateTodo", updateTodo);
  localStorage.setItem("updateTodo", JSON.stringify(updateTodo));
  const localUpdateTodo = localStorage.getItem("updateTodo") ?? "";
  const parsedUpdateTodo = JSON.parse(localUpdateTodo);

  const [title, setTitle] = useState(parsedUpdateTodo.title || "");
  const [completed, setCompleted] = useState(
    parsedUpdateTodo.completed || false
  );

  // Method to patch a todo to jsonPlceholder
  const patchUpdateTodo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updateTodo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: title,
            completed: completed,
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );
      setTitle("");
      setCompleted(false);
      const data = await response.json();
      console.log("edit todo response", data);
      router.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  if (loading) return <div>Loading ...</div>;
  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-12">
        <h1 className="text-4xl font-bold mb-8">Edit Todo</h1>
        <form className="w-1/2">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="completed"
            >
              Completed
            </label>
            <input
              className=""
              id="completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={(e) => patchUpdateTodo(e)}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
