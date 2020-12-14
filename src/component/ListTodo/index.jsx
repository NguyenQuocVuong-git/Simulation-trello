import arrayMove from "array-move";
import React, { useState, useEffect } from "react";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";

import {
  DatePicker,
  Input,
  Form,
  Button,
  Table,
  Popconfirm,
  notification,
  Checkbox,
  Modal,
} from "antd";
import "antd/dist/antd.css";
import "./ListTodo.css";
import { deleteTodo, setActiveTodo, editTodo } from "../../actions/todo";
import { useDispatch , useSelector} from "react-redux";
import { TagsOutlined, EditOutlined,DeleteOutlined , CheckOutlined  } from "@ant-design/icons";
import moment from 'moment';


function formatDay(dateInput) {
  const date = dateInput;
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
 
  var today = yyyy + "/" + mm + "/" + dd
  // var dayFormat = today.toString().split("/").reverse().join("-");
  // console.log("dayformat:", dayFormat);
  // console.log('today', today);
  return today;
 
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
};

const openNotification = (placement) => {
  notification.info({
    message: `Add completed  `,
    placement,
  });
};

const openNotificationDelete = (placement) => {
  notification.info({
    message: ` Delete  Succes `,
    placement,
  });
};

const openNotificationEdit = (placement) => {
  notification.info({
    message: `Edit Succes  `,
    placement,
  });
};

function ListTodo(props) {
  const [form] = Form.useForm();
  const todoList = useSelector((state) => state.todo.todoList);
  const [visible, setVisible] = React.useState(false);
  const unfinished = todoList.filter((todo) => todo.id !== todo.deActive);
  const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
  ));

  const data = unfinished.map((x, index) => ({
    index,
    ...x,
  }));

  const SortableItem = sortableElement((props) => <tr {...props} />);
  const SortableContainer = sortableContainer((props) => <tbody {...props} />);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(data);
  }, [JSON.stringify(unfinished)]);

 

  console.log("data List:", dataSource);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      console.log("Sorted items: ", newData);
      setDataSource(newData);
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };


  

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const onChangeTitle = (e) => {

    console.log("value onChange title:", e.target.value);
    // if (e.target.value.length < 5) {
    //   const action = closeForm();
    //   dispatch(action);
    // } else {
    //   const action = openForm();
    //   dispatch(action);
    // }
  };

  const onChangeDate = (e) => {
    console.log("onChange Date :", e.target.value);
  }

  const showModal = (record) => {
    console.log("record open edit form:", record.id);
    localStorage.setItem('idObjectEdit', record.id);
    console.log("full record : ", record);
    var dateString = record.date;
    console.log("dateString : ", record.date);
    var dateParts = dateString.split("/");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
    console.log("dateObject:", dateObject);




    form.setFieldsValue({
      title: record.title ,
      date : moment(dateString)
    });
    setVisible(true);
  };

  const columns = [
    {
      title: "Sort",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "Title",
      key: "id",
      render: (record) => (
        <Checkbox onClick={(e) => handleCheckBox(e, record)} >
          {/* <h4 className={record.id === record.deActive ? "active" : ""}> */}
          <h4>
            {record.title}
          </h4>
        </Checkbox>
      ),
    },
    {
      title: "Date",
      key: "id",
      render: (record) => (
        <h4 className={record.id === record.deActive ? "active" : ""}>
          {record.date}
        </h4>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className="action-btn">
          <Button type="primary" onClick={() => showModal(record)}  icon={<EditOutlined />} >
            EDIT
          </Button>
          <Modal
            className="title-formPopup"
            title="EDIT TODO"
            visible={visible}
            // onCancel={(record) => handleCancel(record)}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              layout="inline"
              name="nest-messages"
              //  onFinish={() => onEdit(record)}
              onFinish={onEdit}
              form={form}
            >
              <div className="selection-are">
                <Form.Item
                  // name={["todo", "title"]}
                  name="title"
                  label="Title :"
                  rules={[
                    { required: true, message: "Please input your title!" },
                    { min: 5, message: "Title must be minimum 5 characters." },
                  ]}
                  //  onChange={(e) => onChangeTitle(e)}
                >
                  <Input prefix={<TagsOutlined />} value={record.title}/>
                </Form.Item>
                <Form.Item
                  name="date"
                  label="Select a day :"
                  rules={[
                    { required: true, message: "Please input your day!" },
                  ]}
                >
                  <DatePicker
                  format={"YYYY/MM/DD"}
                   />
                </Form.Item>
              </div>
              <div className="btn-add-todo">
                <Form.Item shouldUpdate={true}>
                  {() => (
                    <Button type="primary" htmlType="submit"  icon={<CheckOutlined  />}>
                      CONFIRM
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Form>
          </Modal>
          <Popconfirm
            title="Are you sure to delete this todo?"
            onConfirm={(e) => confirm(record, e)}
            onCancel={cancel}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button
              type="button"
              className="ant-btn ant-btn-primary ant-btn-dangerous"
              href="#"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  function confirm(record) {
    openNotificationDelete("bottomLeft");
    const action = deleteTodo(record);
    dispatch(action);
  }

  function cancel(e) {}

 

  const handleCancel = () => {
    setVisible(false);
  };

  function onEdit(record) {
    console.log("record :", record);
    console.log("date edit :", record.date._d);
    const date = formatDay(record.date._d);
    console.log("date sau khi edit ", date);
     const id = parseInt(localStorage.getItem('idObjectEdit'));
     const title = record.title;
    const object = {
      id : id,
      title : title,
      date : date
    }
     console.log("object day len reducer:",object );
    const action = editTodo(object);
    dispatch(action);
    handleCancel();
    openNotificationEdit("bottomLeft");
    form.resetFields();

  }

  function handleCheckBox(e, record) {
    console.log("e title:", e.target.checked);
    console.log("record title:", record);
    if (e.target.checked === true) {
      openNotification("bottomLeft");
      const action = setActiveTodo(record);
      dispatch(action);
      e.target.checked = false ;
    }
    e.target.checked = false ;
  }

  function showRecord(record) {
    console.log("showRecord:", record);
  }

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  return (
    <div>
       <Table
        pagination={{
          defaultPageSize: 3,
          showSizeChanger: true,
          pageSizeOptions: ["3","5", "6"],
        }}
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        size="middle"
      />
    </div>
  );
}

export default ListTodo;
