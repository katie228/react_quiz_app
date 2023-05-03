import { Button, Form, Input } from "antd";
import React, { useState } from "react";
<<<<<<< HEAD
import CreateQuestion from "./CreateQuestion";
=======
import 'firebase/firestore';
import "../../styles/CreateNewTask.css";

>>>>>>> f6e75957decb6baee28d30473b81ce07860eebb7

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

<<<<<<< HEAD
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
=======
  return (
    <form id="creatent" onSubmit={handleSubmit}>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="question">Вопрос:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      <div>
        <label>Варианты ответа:</label>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option.value}
              onChange={(event) => handleOptionChange(event, index)}
            />
            <label>
              Правильный ответ:
              <input
                type="checkbox"
                checked={option.correct}
                onChange={(event) => handleCheckboxChange(event, index)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>
          Добавить вариант ответа
        </button>
      </div>
      <button type="submit">Создать тест</button>
    </form>
>>>>>>> f6e75957decb6baee28d30473b81ce07860eebb7
  );
};

export default QuizForm;
