import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, DatePicker, notification, Modal } from "antd";
import { addNewTodo, closeForm, openForm } from "../../actions/todo";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./AddTodo.css";
import { TagsOutlined ,PlusCircleOutlined } from "@ant-design/icons";

const randomNumber = () => {
  return 1000 + Math.trunc(Math.random() * 9000);
};

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
  var today = dd + "/" + mm + "/" + yyyy;
  var dayFormat = today.toString().split("/").reverse().join("-");
  return dayFormat;
}

function AddTodo(props) {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState("Content of the modal");
  const dispatch = useDispatch();

  const openNotification = (placement) => {
    notification.info({
      message: `TODO added`,
      placement,
    });
  };

  const onSubmit = (values) => {
    const title = values.todo.title;
    const date = values.todo.date._d;
    const dayFormat = formatDay(date);
    const newId = randomNumber();
    const newTodo = {
      id: newId,
      title: title,
      date: dayFormat,
      deActive: 0,
    };
    const action = addNewTodo(newTodo);
    dispatch(action);
    openNotification("bottomLeft");
    setVisible(false);
    form.resetFields();
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };
<PlusCircleOutlined />
  return (
    <>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />} > 
             ADD TODO    
      </Button >
      <Modal
        className="title-formPopup"
        title="ADD TODO"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="inline"
          name="nest-messages"
          onFinish={onSubmit}
          form={form}
        >
          <div className="selection-are">
            <Form.Item
              name={["todo", "title"]}
              label="Title :"
              rules={[
                { required: true, message: "Please input your title!" },
                { min: 5, message: "Title must be minimum 5 characters." },
              ]}
              // onChange={(e) => onChangeTitle(e)}
            >
              <Input prefix={<TagsOutlined />} />
            </Form.Item>
            <Form.Item
              name={["todo", "date"]}
              label="Select a day :"
              rules={[{ required: true, message: "Please input your day!" }]}
            >
              <DatePicker />
            </Form.Item>
          </div>
          <div className="btn-add-todo">
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button type="primary" htmlType="submit">
                  ADD TODO
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddTodo;
