import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { SlCalender } from "react-icons/sl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Loader from "../components/Loader";
import { FaUndo } from "react-icons/fa";

const categories = [
  { id: 1, type: "all" },
  { id: 2, type: "codetask" },
  { id: 3, type: "office" },
  { id: 4, type: "personal" },
  { id: 5, type: "home" },
  { id: 6, type: "health" },
];

const Home = () => {
  const [todoData, setTodoData] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [calenderStatus, setCalenderStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewTasks, setViewTasks] = useState(false);
  const [loaderShow, setLoader] = useState(false);
  const [completedTaskStatus, setCompletedTaskStatus] = useState(false);
  const [completedTodoList, setCompletedTodoList] = useState([]);
  const [progressPercentage,setProgressPercentage] = useState(0);

  // Form state for all inputs including 'status'
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "low", // 'low', 'medium', or 'high'
    category: "codetask", // default to 'codetask' to match Postman example
    status: "pending", // required status field
  });

  useEffect(() => {
    fetchServerData();
  }, []);

  const fetchServerData = () => {
    setLoader(true);
    axios
      .get("https://taskifyservernew-1.onrender.com/api/todos")
      .then((response) => {
        setTodoData(response.data);
        setLoader(false);
      })
      .catch(() => console.log("Error Fetching Data"));
  };

  const ToggleCalender = () => {
    setCalenderStatus(!calenderStatus);
  };

  const handleDateChange = (selectedDate) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: selectedDate,
    }));
    setCalenderStatus(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      priority: e.target.value,
    }));
  };

  const handleComplete = async (id) => {
    try {
      const updatedTodo = {
        ...todoData,
        status: "completed", // update status
      };

      const response = await axios.put(
        `https://taskifyservernew-1.onrender.com/api/todos/${id}`,
        updatedTodo
      );

      console.log("Todo Updated:", response.data);
       fetchServerData()

      // Remove updated task from pending list
      setTodoData((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleReviveTodo =async(id)=>{
    try{
      const updatedTodo = {
        ...completedTodoList,status:"pending" // update status
      };

      const response = await axios.put( `https://taskifyservernew-1.onrender.com/api/todos/${id}`,updatedTodo)
       console.log("Todo Updated:", response.data);
      fetchServerData()
    }
    catch(error){
      console.log("Error Updating Todo",error)
    }
  }

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://taskifyservernew-1.onrender.com/api/todos/${id}`
      );
      // Remove from UI list
      setTodoData((prev) => prev.filter((t) => t._id !== id));
      // Also remove from completed if applicable
      setCompletedTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Start editing a todo
  const handleEdit = (todo) => {
    setEditingTodoId(todo._id);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: new Date(todo.dueDate),
      priority: todo.priority,
      category: todo.category,
      status: todo.status,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      dueDate: formData.dueDate.toISOString().split("T")[0],
    };

    try {
      if (editingTodoId) {
        await axios.put(
          `https://taskifyservernew-1.onrender.com/api/todos/${editingTodoId}`,
          payload
        );
        setEditingTodoId(null); // Clear edit mode after successful update
      } else {
        await axios.post(
          "https://taskifyservernew-1.onrender.com/api/todos",
          payload
        );
      }
      await fetchTodos();
    } catch (error) {
      console.error("Error posting/updating todo:", error);
    } finally {
      setLoading(false);
      setTimeout(fetchServerData(), 2000);
      setFormData({
        title: "",
        description: "",
        dueDate: new Date(),
        priority: "low",
        category: "codetask",
        status: "pending",
      });
    }
  };

  const filteredTodos =
    selectedCategory === "all"
      ? todoData.filter((todo) => todo.status !== "completed")
      : todoData.filter(
          (todo) =>
            todo.category.toLowerCase() === selectedCategory.toLowerCase() &&
            todo.status !== "completed"
        );

  const changeViewTaskStatus = () => {
    setCompletedTaskStatus(!completedTaskStatus);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      const completedTodos = todoData.filter(
        (eachTodo) => eachTodo.status === "completed"
      );
      const statusPercentage = (completedTodos.length / todoData.length) * 100
      setProgressPercentage(Math.round(statusPercentage))
      setCompletedTodoList(completedTodos);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [todoData]);


  console.log("completed Todo", completedTodoList);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-[30%] gap-3 mt-4 mb-8">
        {categories.map((eachtask) => (
          <div
            key={eachtask.id}
            onClick={() => setSelectedCategory(eachtask.type)} // update state on click
            className={`p-2 px-3 py-1 flex items-center justify-center border border-red-400 cursor-pointer shadow-md w-full rounded-lg 
        ${
          selectedCategory === eachtask.type
            ? "bg-red-700 text-white"
            : "hover:text-white hover:bg-red-400"
        }`}
          >
            <p className="capitalize text-md">{eachtask.type}</p>
          </div>
        ))}
      </div>
      {/* Horizontal container for todo and create todo and status */}
      <div className="flex items-start justify-between w-full p-10 gap-4">
        {/* Status Bar */}
        <>
          {completedTaskStatus ? (
            <div className="h-[60vh] overflow-y-scroll p-2  w-[30%] ">
             <div className="flex w-full items-center justify-between p-2 bg-red-700 rounded-md mb-2">
               <h1 className="text-md font-semibold text-white">COMPLETED TODOS</h1>
               <button className="bg-red-300 text-white rounded-full px-3 cursor-pointer py-1" onClick={changeViewTaskStatus}>
                X
               </button>
             </div>
              {completedTodoList?.map((todo, index) => {
                return (
                  <div
                    className="flex flex-col items-start justify-start "
                    key={todo._id}
                  >
                    <div className="flex items-start justify-start gap-2 bg-red-400 text-white w-full rounded-md p-2 mb-2">
                      <div className="font-semibold text-sm">{index + 1}.</div>
                      <div className="w-full">
                        <div className="w-full flex items-center justify-between gap-2">
                      <h1 className="text-sm font-semibold capitalize">
                        {todo.title}
                      </h1>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReviveTodo(todo._id)}
                          className="text-white hover:text-yellow-300 cursor-pointer"
                          title="Revive Todo"
                        >
                          <FaUndo size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(todo._id)}
                          className="text-white hover:text-red-700 cursor-pointer"
                          title="Delete Todo"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                        <p className="text-xs italic capitalize">{todo.description}</p>
                        <p className="text-[10px] bg-red-300 p-1 w-fit rounded-md mt-2 capitalize ">
                          {todo.category}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center shadow-md w-[30%] bg-red-200 p-3 rounded-md">
          <div className="flex flex-col items-start justify-start p-1 gap-4 w-fit m-3">
            <p className="text-xs">Your today's task almost done!</p>
            <button
              type="button"
              onClick={changeViewTaskStatus}
              className="rounded-md shadow-md text-white text-xs px-5 py-2 bg-red-400 cursor-pointer hover:text-red-400 hover:bg-white hover:border hover:border-red-700"
            >
              View Task's
            </button>
          </div>
          {/* status bar */}
          <div
            style={{ width: 120, height: 120 }}
            className="flex flex-col items-center justify-center p-1 m-3"
          >
            <CircularProgressbar
              value={progressPercentage}
              text={`${progressPercentage}%`}
              styles={buildStyles({
                textColor: "#f04337",
                pathColor: "#f06359",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
          <div>
            {completedTodos.map((task)=>{
              return(
                <div>
                  <h1>{task.title}</h1>
                </div>
              )
            })}
          </div>
        </div>
          )}
        </>

        {loaderShow ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-4 w-[50%] items-center justify-start  p-2 m-2 h-[60vh] overflow-y-scroll">
          {filteredTodos.length===0 ? (<div><h1>No Tasks available!</h1></div>):(<>  {filteredTodos.reverse().map((eachTodo) => (
              <div
                key={eachTodo._id}
                className="w-full flex flex-col shadow-md items-start justify-start bg-red-400 p-3 rounded-lg text-white"
              >
                <div className="flex items-start justify-start p-3 w-full">
                  <input
                    type="checkbox"
                    className="mt-1 mr-3 size-4"
                    onChange={() => handleComplete(eachTodo._id)}
                  />
                  <div className="w-full">
                    <div className="w-full flex items-center justify-between gap-2">
                      <h1 className="text-sm font-semibold capitalize">
                        {eachTodo.title}
                      </h1>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(eachTodo)}
                          className="text-white hover:text-yellow-300 cursor-pointer"
                          title="Edit Todo"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(eachTodo._id)}
                          className="text-white hover:text-red-700 cursor-pointer"
                          title="Delete Todo"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs italic capitalize">{eachTodo.description}</p>
                  </div>
                </div>
              </div>
            ))}</>)}
          </div>
        )}
        <div className="flex flex-col w-[20%] items-start justify-center">
          <div className="w-full items-center justify-center p-1 text-white text-center font-semibold border border-1 border-red-400 bg-red-700 rounded-md ">
            <p>ADD TASK</p>
          </div>
          <form
            className="flex flex-col items-start justify-center gap-2 mt-2 w-full"
            onSubmit={handleSubmit}
          >
            <label className="text-red-500 text-sm" htmlFor="title">
              Todo
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Todo Name"
              className="outline w-full outline-2 text-sm rounded-md p-1 outline-red-400"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <label className="text-red-500 text-sm" htmlFor="description">
              More about todo
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="More about todo"
              className="outline w-full h-[2cm] outline-2 text-sm rounded-md p-1 outline-red-400"
              value={formData.description}
              onChange={handleInputChange}
            />

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <label className="text-red-500 text-sm" htmlFor="calender">
                  Due
                </label>
                <div
                  className="relative flex flex-col gap-2 w-fit"
                  id="calender"
                >
                  <button
                    type="button"
                    onClick={ToggleCalender}
                    className="bg-red-400 p-1 text-white rounded-md cursor-pointer flex items-center justify-center"
                  >
                    <SlCalender size={20} />
                  </button>

                  {calenderStatus && (
                    <div
                      className="
                      absolute 
                      top-full 
                      left-1/2 
                      -translate-x-1/2 
                      mt-2 
                      z-[9999] 
                      bg-white 
                      shadow-lg 
                      rounded-md 
                      w-80
                      max-h-[80vh] 
                      overflow-auto
                    "
                    >
                      <Calendar
                        onChange={handleDateChange}
                        value={formData.dueDate}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-red-400">Priority</p>
                <div className="flex items-center justify-center gap-1 text-red-400">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handlePriorityChange}
                      className="accent-red-400"
                    />
                    L
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handlePriorityChange}
                      className="accent-red-400"
                    />
                    M
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handlePriorityChange}
                      className="accent-red-400"
                    />
                    H
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-red-500 text-sm" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="outline outline-2 outline-red-400 rounded-md text-sm p-1 cursor-pointer"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="codetask">Code Task</option>
                  <option value="office">Office</option>
                  <option value="personal">Personal</option>
                  <option value="home">Home</option>
                  <option value="health">Health</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-start mt-2 w-full">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-400 w-fit text-sm mt-4 cursor-pointer hover:border hover:border-red-700 text-white px-3 py-2 shadow-md rounded-xl hover:bg-white hover:text-red-400 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "+ Create Todo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
