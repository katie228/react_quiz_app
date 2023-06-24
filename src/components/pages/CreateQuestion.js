import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Input, Modal, Row } from "antd";
import { initializeApp } from "firebase/app";
import "firebase/database";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../Button.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSyR-75dzFPSlknW1Pj8VSkxcnWqyJ8pI",
  authDomain: "quiz-1c883.firebaseapp.com",
  projectId: "quiz-1c883",
  storageBucket: "quiz-1c883.appspot.com",
  messagingSenderId: "46773582129",
  appId: "1:46773582129:web:ad3af0bde57309c2f85810",
  databaseURL: "https://quiz-1c883-default-rtdb.firebaseio.com",
};

initializeApp(firebaseConfig);
const db = getDatabase();

const CreateQuestion = ({
  quizTopic,
  discipline,
  quizDescription,
  quizDuration,
}) => {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [questions, setQuestions] = useState([
    {
      content: "",
      points: 0,
      options: [],
    },
  ]);

  const [totalQuestions, setTotalQuestions] = useState(1);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const history = useHistory();

  const handleAddQuestion = () => {
    setQuestions([...questions, { content: "", points: 0, options: [] }]);
    setQuestionIndex(questionIndex + 1);
    setTotalQuestions(totalQuestions + 1);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestionIndex(questionIndex - 1);
    setQuestions(updatedQuestions);
    setTotalQuestions(totalQuestions - 1);
  };

  const handleQuestionContentChange = (index, content) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].content = content;
    setQuestions(updatedQuestions);
  };

  const handleQuestionPointsChange = (index, points) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].points = points;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push({ content: "", correct: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleOptionContentChange = (questionIndex, optionIndex, content) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].content = content;
    setQuestions(updatedQuestions);
  };

  const handleOptionCorrectChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].correct =
      e.target.checked;
    setQuestions(updatedQuestions);
  };

  const calculateTotalPoints = () => {
    let totalPoints = 0;
    questions.forEach((question) => {
      totalPoints += parseInt(question.points, 10);
    });
    return totalPoints;
  };

  const handleFinishQuizCreation = () => {
    const totalQuestions = questions.length;
    const totalPoints = calculateTotalPoints();

    const quizId = uuidv4();
    const quizData = {
      id: quizId,
      totalquestions: totalQuestions,
      totalpoints: totalPoints,
      title: quizTopic,
      discipline: discipline,
      quizDescription: quizDescription,
      quizDuration: quizDuration,
      questions: questions.map((question) => {
        return {
          content: question.content,
          points: question.points,
          options: question.options.map((option) => {
            return {
              content: option.content,
              correct: option.correct,
            };
          }),
        };
      }),
    };

    const quizzesRef = ref(db, "quizzes");
    push(quizzesRef, quizData)
      .then(() => {
        console.log("Данные успешно отправлены в Firebase");
        setSuccessModalVisible(true);
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных в Firebase:", error);
      });
  };

  const handleModalOk = () => {
    setSuccessModalVisible(false);
    history.push("/home"); // Переход на другую страницу
  };

  return (
    <div>
      <h1>{quizTopic}</h1>

      {questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <Form layout="vertical">
            <h2>Номер вопроса: {questionIndex + 1}</h2>
            <Form.Item label="Содержание вопроса">
              <Input
                value={question.content}
                onChange={(e) =>
                  handleQuestionContentChange(questionIndex, e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Количество баллов">
              <Input
                type="number"
                value={question.points}
                onChange={(e) =>
                  handleQuestionPointsChange(questionIndex, e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Варианты ответа">
              {question.options.map((option, optionIndex) => (
                <Row key={optionIndex} gutter={16}>
                  <Col flex="auto">
                    <Input
                      value={option.content}
                      onChange={(e) =>
                        handleOptionContentChange(
                          questionIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Checkbox
                      checked={option.correct}
                      onChange={(e) =>
                        handleOptionCorrectChange(questionIndex, optionIndex, e)
                      }
                    >
                      Верный ответ
                    </Checkbox>
                  </Col>
                  <Col>
                    {optionIndex > 0 && (
                      <MinusCircleOutlined
                        onClick={() =>
                          handleRemoveOption(questionIndex, optionIndex)
                        }
                      />
                    )}
                  </Col>
                </Row>
              ))}
            </Form.Item>

            <Button
              style={{
                marginTop: "3px",
              }}
              type="dashed"
              onClick={() => handleAddOption(questionIndex)}
              block
              icon={<PlusOutlined />}
            >
              Добавить вариант ответа
            </Button>
          </Form>

          {questionIndex > 0 && (
            <Button
              style={{
                marginTop: "3px",
              }}
              type="dashed"
              onClick={() => handleRemoveQuestion(questionIndex)}
              block
              danger
            >
              Удалить вопрос
            </Button>
          )}

          <hr />
        </div>
      ))}

      <Button
        style={{
          marginTop: "3px",
        }}
        type="dashed"
        onClick={handleAddQuestion}
        block
        icon={<PlusOutlined />}
      >
        Создать новый вопрос
      </Button>

      <Button
        style={{
          marginTop: "3px",
        }}
        type="primary"
        onClick={handleFinishQuizCreation}
        block
      >
        Завершить создание теста
      </Button>

      <Modal visible={successModalVisible} onOk={handleModalOk}>
        <p>Тест успешно добавлен!</p>
      </Modal>
    </div>
  );
};

export default CreateQuestion;
