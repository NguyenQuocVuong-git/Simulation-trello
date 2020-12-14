import React from "react";
import ListTodo from "../component/ListTodo/index";
import AddTodo from "../component/AddTodo/index";
import "./Homepage.css";
import Requirements from "../component/Progress";
import ListTodoComple from "../component/ListTodoComple";

function HomePages() {
  return (
    <div className="main-content">
      <h2 className="header">TODO APP</h2>
      <div className="add-todo">
        <AddTodo />
      </div>
      <div className="requirement">
        <Requirements />
      </div>
      <div className="list-todo">
        <ListTodo />
      </div>

      <div>
        <h2 className="header">COMPLE</h2>
        <ListTodoComple />
      </div>
    </div>
  );
}

export default HomePages;
