import React from 'react';
import 'antd/dist/antd.css';
import { useSelector} from "react-redux";
import { Progress } from 'antd';


function Requirements(props) {
    const todoList = useSelector((state) => state.todo.todoList);
    const totalTodo = todoList.length;
     // console.log("totalTodo", totalTodo);
    const listTodoComplete = todoList.filter((todo) => todo.id === todo.deActive);
    const finishedNumber = listTodoComplete.length;
    const listTodoNotComplete = totalTodo - listTodoComplete;
    // console.log("unfinishedNumber", finishedNumber);
    var progressNumber;
    if(listTodoNotComplete === 0){
        progressNumber = 100;
    }else{
        // progressNumber = Math.floor(100/unfinishedNumber);
        progressNumber = (Math.ceil(100/(totalTodo)) * finishedNumber);
        console.log("else");
    }
    // console.log("progressNumber", progressNumber);
    return (
        <div>
            <Progress percent={progressNumber} />
        </div>
    );
    
}

export default Requirements;