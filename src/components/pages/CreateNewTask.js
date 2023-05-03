import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import CreateQuestion from "./CreateQuestion";

const QuizForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Здесь вы можете выполнить запрос к серверу для создания викторины
    console.log(values);
    setLoading(false);
  };
  const [showNewPage, setShowNewPage] = useState(false);

  const handleButtonClick = () => {
    setShowNewPage(true);
  };
  return (
    <div>
      {!showNewPage && (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="quizTopic"
            label="Тема викторины"
            rules={[{ required: true, message: "Введите тему викторины" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="discipline"
            label="Дисциплина"
            rules={[{ required: true, message: "Введите дисциплину" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quizDescription"
            label="Описание викторины"
            rules={[{ required: true, message: "Введите описание викторины" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="quizDuration"
            label="Время прохождения (в секундах)"
            rules={[{ required: true, message: "Введите время прохождения" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={handleButtonClick}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Создать вопросы
            </Button>
          </Form.Item>
        </Form>
      )}
      {showNewPage && <CreateQuestion />}
    </div>
  );
};

export default QuizForm;
