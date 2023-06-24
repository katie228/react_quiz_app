import { Form, Input } from "antd";
import React, { useState } from "react";
import "../../styles/CreateNewTask.css";
import Button from "../Button.js";
import CreateQuestion from "./CreateQuestion";

const CreateNewTask = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setShowNewPage(true);
    setLoading(false);
  };
  const [showNewPage, setShowNewPage] = useState(false);

  return (
    <div>
      {!showNewPage && (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="quizTopic"
            label="Тема теста"
            rules={[{ required: true, message: "Введите тему теста" }]}
            className="custom-label"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="discipline"
            label="Дисциплина"
            rules={[{ required: true, message: "Введите дисциплину" }]}
            className="custom-label" // Применяем пользовательский класс
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quizDescription"
            label="Описание теста"
            rules={[{ required: true, message: "Введите описание теста" }]}
            className="custom-label" // Применяем пользовательский класс
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="quizDuration"
            label="Время прохождения в минутах "
            rules={[
              {
                required: true,
                message: "Введите время прохождения в минутах",
              },
            ]}
            className="custom-label" // Применяем пользовательский класс
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Перейти к созданию вопросов
            </Button>
          </Form.Item>
        </Form>
      )}
      {showNewPage && (
        <CreateQuestion
          quizTopic={form.getFieldValue("quizTopic")}
          discipline={form.getFieldValue("discipline")}
          quizDescription={form.getFieldValue("quizDescription")}
          quizDuration={form.getFieldValue("quizDuration")}
        />
      )}
    </div>
  );
};

export default CreateNewTask;
