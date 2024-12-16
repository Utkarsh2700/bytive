"use client";

import { add } from "@/lib/features/todos/todoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const Add = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { value: todos, error } = useAppSelector((state) => state.todo);
  const dispatch = useAppDispatch();

  // Method to post a todo to jsonPlceholder
  const postTodo = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // const length = todos.length + 1;
    const todo = {
      id: 201,
      userId: 11,
      title: title,
      completed: completed,
    };

    dispatch(add([todo]));

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-Type": "application/json;  charset=UTF-8",
          },
        }
      );
      const data = await response.json();
      router.push("/");
    } catch (error) {
      console.log("Error :", error);
    }
    setLoading(false);
  };

  // function to change the completed stauts of todo
  const handleCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompleted(e.target.checked);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Add Todo
        </h2>
        <form className="mt-4 space-y-6">
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title For Todo"
              value={title}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="completed"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Completed
            </label>
            <input
              type="checkbox"
              id="completed"
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => handleCompleted(e)}
            />
          </div>
          <button
            onClick={(e) => postTodo(e)}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
