import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [todoData, setTodoData] = useState("");
  const [todoEditData, setTodoEditData] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [editId, setEditId] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/posts", { goal: todoData });
    setTodoData("");
  };

  useEffect(() => {
    const fetchTodoData = async () => {
      const response = await axios.get("http://localhost:3000/posts");
      setFetchedData(response.data);
    };
    fetchTodoData();
  }, [fetchedData]);

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);
  };
  const toggleEdit = (text, id) => {
    setToggle(!toggle);
    setTodoEditData(text);
    setEditId(id);  
  };
  const handleEdit = async (e, id, text) => {
    e.preventDefault();
    axios.patch(`http://localhost:3000/posts/${id}`, {
      goal: text,
    });
    setTodoEditData("")
    setToggle(false)
  };
  return (
    <>
      <div className="app">
        <div className="todo-container">
          <h1>TODO</h1>
          <form className="form-content" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Add Task"
              className="input-field"
              value={todoData}
              onChange={(e) => {
              setTodoData(e.target.value);
              }}
            />
          </form>
          {toggle && (
            <form
              className="form-edit"
              onSubmit={(e) => handleEdit(e,editId, todoEditData)}
            >
              <input
                type="text"
                className="input-edit"
                value={todoEditData}
                onChange={(e) => setTodoEditData(e.target.value)}
              />
            </form>
          )}

          <div className="show-task">
            {fetchedData.map((ele,id) => {
              return (
                <div className="item" key={ele.id}>
                  <p>{ele.goal}</p>
                  <i
                    class="fa-solid fa-pen edit"
                    onClick={() => toggleEdit(ele.goal, ele.id)}
                  ></i>
                  <i
                    className="fa-regular fa-trash-can delete"
                    onClick={() => deleteItem(ele.id)}
                  ></i>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
