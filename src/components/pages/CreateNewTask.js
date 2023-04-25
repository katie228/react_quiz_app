//import firebase from "firebase/app";
import "firebase/database";
import React, { useState } from "react";
import 'firebase/firestore';
import "../../styles/CreateNewTask.css";


const CreateTest = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ value: "", correct: false }]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddOption = () => {
    setOptions([...options, { value: "", correct: false }]);
  };

  const handleOptionChange = (event, index) => {
    const newOptions = [...options];
    newOptions[index].value = event.target.value;
    setOptions(newOptions);
  };

  const handleCheckboxChange = (event, index) => {
    const newOptions = [...options];
    newOptions[index].correct = event.target.checked;
    setOptions(newOptions);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Формируем объект с данными для отправки на сервер
    const data = {
      question,
      options,
    };

    // Сохраняем данные в базу данных Firebase
    const database = firebase.database();
    const newTestRef = database.ref("tests").push();
    newTestRef.set(data, (error) => {
      if (error) {
        setError("Ошибка при сохранении теста.");
        setMessage("");
      } else {
        setMessage("Тест успешно создан!");
        setError("");
      }
    });
  };

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
  );
};

export default CreateTest;
