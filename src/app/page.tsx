"use client";
import {
  addInitialItems,
  remove,
  updateTask,
  updateTodo,
} from "@/lib/features/todos/todoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DropArea from "@/components/DropArea";

export default function Home() {
  const router = useRouter();
  const { value: todos } = useAppSelector((state) => state.todo);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  // console.log("todos", todos);

  const [activeCard, setActiveCard] = useState<number>();

  useEffect(() => {
    fetchTodos();
  }, []);

  // Method to fetch todos from  jsonPlceholder to display on homepage
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      // console.log("data", data);
      dispatch(addInitialItems(data));
      localStorage.setItem("todos", JSON.stringify(data));
    } catch (error) {
      console.log("Error :", error);
    }
    setLoading(false);
  };

  // function to update the todo completion status on homepage
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedTodo = todos.find((todo) => todo.id === id);

    if (updatedTodo) {
      dispatch(updateTask({ ...updatedTodo, completed: e.target.checked }));
    }
  };

  // function to redirect to edit page and update the todo
  const handleClickToEdit = (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      router.push(`/edit/${todo.id}`);
    }
  };

  // function to handle drag and drop functionality
  const onDrop = (status: boolean, position: number) => {
    console.log(
      `${activeCard} is going to place into ${status} and at the position ${position}`
    );
    if (activeCard === null || activeCard === undefined) return;

    const updateTodos = [...todos];
    // console.log("updateTodos", updateTodos);
    const todoToMove = updateTodos[activeCard];
    // console.log("taskToMove", todoToMove);
    const updatedTask = updateTodos.filter(
      (todo, index) => index !== activeCard
    );

    // console.log("updatedTask", updatedTask);

    const updatedTaskList = updatedTask.splice(position, 0, {
      ...todoToMove,
      completed: status,
    });

    dispatch(updateTodo(updatedTask));

    localStorage.setItem("todos", JSON.stringify(updateTask));
    setActiveCard(-1);
  };
  // function to handle deleting of a todo
  const handleRemove = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    dispatch(remove(updatedTodos));
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  return (
    !loading && (
      <>
        <ul className="ml-4 list-disc font-semibold text-sm mt-4 mx-2">
          <li>
            Click on the title of a todo to edit or check/uncheck the checkbox
            to change the status from pending to completed or vice-versa.
          </li>
          <li>
            Hover over todo and drag as soon as cursor changes to drag.Priortize
            a particular to by dragging it to top or above todo.{" "}
          </li>
        </ul>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Todo List
          </h2>
          <div className="flex justify-evenly items-center font-semibold text-base">
            <h1>Completed</h1>

            <h1>Pending</h1>
          </div>
          <div className="flex">
            {/* Completed Todos */}
            <div className="mr-2">
              <ul className="mt-6 space-y-4">
                <DropArea onDrop={() => onDrop(true, 0)} />
                {todos.map((item, index) => (
                  <div className="" key={item.id}>
                    <div className="completed">
                      {item.completed && (
                        <React.Fragment>
                          <li
                            // key={index}
                            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-grab active:opacity-75 active:border-[#111]"
                            draggable
                            onDragStart={() => setActiveCard(index)}
                            onDragEnd={() => setActiveCard(-1)}
                          >
                            <div className="flex items-center cursor-pointer">
                              <p className="mr-2">{index + 1}.</p>
                              <input
                                type="checkbox"
                                checked={item.completed}
                                // value={item.completed}
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                onChange={(e) => handleCheck(e, item.id)}
                              />
                              <p
                                className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                                onClick={(id) => handleClickToEdit(item.id)}
                              >
                                {item.title}
                              </p>
                            </div>
                            <button
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              aria-label={`Delete todo item ${item.userId}`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => handleRemove(item.id)}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </li>
                          <DropArea
                            onDrop={() => onDrop(item.completed, index)}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                ))}
              </ul>
            </div>
            <div className="ml-2">
              {/* Pending Todos */}
              <ul className="mt-6 space-y-4">
                <DropArea onDrop={() => onDrop(false, 0)} />
                {todos.map((item, index) => (
                  <div className="pending" key={item.id}>
                    {!item.completed && (
                      <React.Fragment>
                        <li
                          // key={index}
                          className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-grab active:opacity-75 active:border-[#111]"
                          draggable
                          onDragStart={() => setActiveCard(index)}
                          onDragEnd={() => setActiveCard(-1)}
                        >
                          <div className="flex items-center cursor-pointer">
                            <p className="mr-2">{index + 1}.</p>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e) => handleCheck(e, item.id)}
                            />
                            <p
                              className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                              onClick={(id) => handleClickToEdit(item.id)}
                            >
                              {item.title}
                            </p>
                          </div>
                          <button
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            aria-label={`Delete todo item ${item.userId}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => handleRemove(item.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </li>
                        <DropArea
                          onDrop={() => onDrop(item.completed, index)}
                        />
                      </React.Fragment>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  );
}
