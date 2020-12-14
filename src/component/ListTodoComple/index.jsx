import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Popconfirm, notification, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./ListTodoComple.css";
import { deleteTodo, reworkTodo } from "../../actions/todo";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import arrayMove from "array-move";

function ListTodoComple(props) {
  const dispatch = useDispatch();
  const listTodoComple = useSelector((state) =>
    state.todo.todoList.filter((todo) => todo.id === todo.deActive)
  );

  const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
  ));

  const data = listTodoComple.map((x, index) => ({
    index,
    ...x,
  }));

  const SortableItem = sortableElement((props) => <tr {...props} />);
  const SortableContainer = sortableContainer((props) => <tbody {...props} />);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(data);
    console.log("useEfffect");
  }, [listTodoComple.length]);

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
      key: "title",
      render: (record) => (
        <Checkbox onClick={(e) => handleCheckBox(e, record)}>
          <h4 className="active">{record.title}</h4>
        </Checkbox>
      ),
    },
    {
      title: "Date",
      key: "date",
      render: (record) => <h4 className="active">{record.date}</h4>,
    },
    {
      title: "Action",
      render: (record) => (
        <div className="action-btn">
          <Popconfirm
            title="Are you sure to delete this todo?"
            onConfirm={() => confirm(record)}
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

  const openNotificationDelete = (placement) => {
    notification.info({
      message: `TODO delete  `,
      placement,
    });
  };

  const openNotification = (placement) => {
    notification.info({
      message: `REWORK  `,
      placement,
    });
  };

  function confirm(record) {
    console.log("record confirm todocomplete", record);
    openNotificationDelete("bottomLeft");
    const action = deleteTodo(record);
    dispatch(action);
  }

  function cancel() {}

  function handleCheckBox(e, record) {
    console.log("e title:", e.target.checked);
    console.log("record title:", record);
    if (e.target.checked === true) {
      openNotification("bottomLeft");
      const action = reworkTodo(record);
      dispatch(action);
      e.target.checked = false;
    }
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
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["3", "6"],
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

export default ListTodoComple;
