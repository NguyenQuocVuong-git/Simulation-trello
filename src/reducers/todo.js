const findIndex = (listTodo , id) =>{
  var result = -1;
  listTodo.forEach((taks ,index) => {
    if(taks.id === id){
      result = index;
    }
  });
  return result;
}

const initialState = {
    todoList : [
        {
            id : 1 ,
            title : "Use Hooks in a React application (Default TODO from INITIAL_STATE.js)",
            date : "2020-12-05",
            deActive :  0
        }
    ],
  
}

const todoReducers = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TODO": {
      const newList = [...state.todoList];
      newList.push(action.payload);
      return {
          ...state,
          todoList : newList
      };
    }

    case 'SET_DEACTIVE_TODO' : {
      const newList = [ ...state.todoList];
      const newDeactiveId = action.payload.id;
      const indexObject = findIndex(newList,newDeactiveId);
      newList[indexObject].deActive = newDeactiveId;
      return {
        ...state,
        todoList : newList
      };
    }

    case 'DELETE_ITEM' : {
      const newList = [ ...state.todoList];
      const id = action.payload.id;
      console.log("id xoa : ", action.payload.id);
      const indexObject = findIndex(newList,id);
      newList.splice(indexObject, 1);
      return {
        ...state,
        todoList : newList
      }
    }

    case 'EDIT_ITEM' : {
     console.log("action reducer:", action);
     const newList = [ ...state.todoList];
      console.log("id reducer :", action.payload.id);
      const newEditId =action.payload.id;
      const newEditTitle = action.payload.title;
      const newEditDate = action.payload.date;
      console.log("date edit :", newEditDate);
      console.log("title edit :", newEditTitle);
      console.log("id edit :", newEditId);
      const indexObject = findIndex(newList,newEditId);
      newList[indexObject].title = newEditTitle;
      newList[indexObject].date = newEditDate;
      return {
        ...state,
        todoList : newList
      }
    }

    case 'REWORK_ITEM' : {
      const newList = [ ...state.todoList];
      const id = action.payload.id;
      const indexObject = findIndex(newList,id);
      newList[indexObject].deActive = 0;
      return {
        ...state,
        todoList : newList
      }
    }

    default:
      return state;
  }
}

export default todoReducers;
