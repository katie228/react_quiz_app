import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import CreateQuestion from "./CreateQuestion";

const QuizForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setShowNewPage(true); // изменено
    setLoading(false);
  };
  const [showNewPage, setShowNewPage] = useState(false);

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
            <Button type="primary" htmlType="submit" loading={loading}>
              Создать вопросы
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

export default QuizForm;
