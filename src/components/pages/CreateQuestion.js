import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, message, Row, Upload } from "antd";
import React, { useState } from "react";

const CreateQuestion = () => {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [questions, setQuestions] = useState([
    {
      content: "",
      points: 0,
      options: [],
      image: null,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { content: "", points: 0, options: [], image: null },
    ]);
    setQuestionIndex(questionIndex + 1);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestionIndex(questionIndex - 1);
    setQuestions(updatedQuestions);
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
  const handleFinishQuizCreation = () => {
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
      <h1>Тема викторины</h1>

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
            ы
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
