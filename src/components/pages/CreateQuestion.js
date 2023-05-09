import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, message, Row, Upload } from "antd";
import { initializeApp } from "firebase/app";
import "firebase/database";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
      image: null,
    },
  ]);

  const [totalQuestions, setTotalQuestions] = useState(1);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { content: "", points: 0, options: [], image: null },
    ]);
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
    updatedQuestions[index].options.push({ content: "", isCorrect: false });
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
    updatedQuestions[questionIndex].options[optionIndex].isCorrect =
      e.target.checked;
    setQuestions(updatedQuestions);
  };
  const handleQuestionImageUpload = (index, file) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].image = file;
    setQuestions(updatedQuestions);
  };

  const handleQuestionImageRemove = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].image = null;
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

    const quizId = uuidv4(); // генерация уникального идентификатора
    const quizData = {
      id: quizId, // добавление идентификатора к объекту quizData
      totalquestions: totalQuestions,
      totalpoints: totalPoints,
      title: quizTopic, // Замените на фактическое значение заголовка викторины, полученное из поля ввода
      discipline: discipline,
      quizDescription: quizDescription,
      quizDuration: quizDuration,
      questions: questions.map((question) => {
        return {
          content: question.content, // Значение содержания вопроса, полученное из поля ввода
          points: question.points, // Значение количества баллов, полученное из поля ввода
          options: question.options.map((option) => {
            return {
              content: option.content, // Значение содержания варианта ответа, полученное из поля ввода
              isCorrect: option.isCorrect, // Значение правильности выбранного варианта ответа, полученное из чекбокса
            };
          }),
          image: question.image, // Ссылка на загруженное изображение, если есть
        };
      }),
    };
    // Подсчет количества вопросов и суммы баллов за все вопросы

    // Отправьте данные в Firebase
    const quizzesRef = ref(db, "quizzes");
    push(quizzesRef, quizData)
      .then(() => {
        console.log("Данные успешно отправлены в Firebase");
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных в Firebase:", error);
      });

    questions.forEach((question, index) => {
      if (question.image) {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(
            `Вопрос ${index + 1} - Содержание изображения:`,
            reader.result
          );
        };
        reader.readAsDataURL(question.image);
      }
    });

    console.log("Все вопросы:", questions);
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
            <Form.Item label="Картинка">
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Можно загружать только изображения!");
                  }
                  return isImage ? true : Upload.LIST_IGNORE;
                }}
                onChange={(info) => {
                  if (info.file.status === "uploading") {
                    handleQuestionImageUpload(questionIndex, info.file);
                  }
                  if (info.file.status === "done") {
                    message.success(`${info.file.name} успешно загружен!`);
                  }
                  if (info.file.status === "error") {
                    message.error(`${info.file.name} загрузка не удалась.`);
                  }
                }}
                onRemove={() => handleQuestionImageRemove(questionIndex)}
              >
                {question.image ? (
                  <img
                    src={URL.createObjectURL(new Blob([question.image]))}
                    alt="Картинка"
                    style={{ maxWidth: "100%" }}
                    onLoad={() =>
                      URL.revokeObjectURL(
                        URL.createObjectURL(new Blob([question.image]))
                      )
                    }
                  />
                ) : (
                  <div>
                    {question.imageLoading ? (
                      <LoadingOutlined />
                    ) : (
                      <PlusOutlined />
                    )}
                    <div style={{ marginTop: 8 }}>Загрузить</div>
                  </div>
                )}
              </Upload>
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
                      checked={option.isCorrect}
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
        type="dashed"
        onClick={handleAddQuestion}
        block
        icon={<PlusOutlined />}
      >
        Создать новый вопрос
      </Button>

      <Button type="primary" onClick={handleFinishQuizCreation} block>
        Завершить создание викторины
      </Button>
    </div>
  );
};

export default CreateQuestion;
