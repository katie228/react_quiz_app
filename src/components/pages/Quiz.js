import { get, getDatabase, ref, set } from "firebase/database";
import _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../contexts/AuthContext";
import useQuestions from "../../hooks/useQuestions";
import Answers from "../Answers";
import ProgressBar from "../ProgressBar";

const initialState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "questions":
      action.value.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return action.value;
    case "answer":
      const questions = _.cloneDeep(state);
      questions[action.questionID].options[action.optionIndex].checked =
        action.value;

      return questions;
    default:
      return state;
  }
};

export default function Quiz() {
  const { id } = useParams();
  const { loading, error, questions } = useQuestions(id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [qna, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  const history = useHistory();
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    dispatch({
      type: "questions",
      value: questions,
    });
  }, [questions]);

  useEffect(() => {
    let timer;

    const fetchQuizDuration = async () => {
      try {
        const db = getDatabase();
        const quizzesRef = ref(db, "quizzes/");
        const snapshot = await get(quizzesRef);

        let duration = 0;

        snapshot.forEach((quizSnapshot) => {
          const quiz = quizSnapshot.val();
          if (quiz.id === id) {
            duration = quiz.quizDuration || 0;
          }
        });

        console.log("Duration from database:", duration);
        setTimeLeft(duration * 60);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuizDuration();

    return () => {
      clearInterval(timer);
    };
  }, [id]);

  useEffect(() => {
    let timer;

    timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      submit();
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setTimeText(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  }, [timeLeft]);

  async function submit() {
    const { uid, displayName } = currentUser;
    const score = calculateScore();

    const db = getDatabase();
    const resultRef = ref(db, `result/${uid}/${id}`);

    const snapshot = await get(resultRef);

    let results = {};

    if (snapshot.exists()) {
      results = snapshot.val();
    }

    const resultKey = uuidv4();
    const timestamp = new Date().toLocaleString();
    results[resultKey] = {
      qna,
      score,
      timestamp,
      displayName,
    };

    await set(resultRef, results);

    history.push({
      pathname: `/result/${id}`,
      state: {
        qna,
        score,
      },
    });
  }

  function handleAnswerChange(e, index) {
    dispatch({
      type: "answer",
      questionID: currentQuestion,
      optionIndex: index,
      value: e.target.checked,
    });
  }

  function nextQuestion() {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevCurrent) => prevCurrent + 1);
    }
  }

  function prevQuestion() {
    if (currentQuestion >= 1 && currentQuestion <= questions.length) {
      setCurrentQuestion((prevCurrent) => prevCurrent - 1);
    }
  }

  function calculateScore() {
    let score = 0;

    qna.forEach((question) => {
      question.options.forEach((option) => {
        if (option.checked && option.correct) {
          score += parseInt(question.points, 10);
        }
      });
    });

    return score;
  }

  const percentage =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      {loading && <div></div>}
      {error && <div>Ошибка!</div>}
      {!loading && !error && qna && qna.length > 0 && (
        <>
          <div>Оставшееся время: {timeText}</div>
          <h1>{qna[currentQuestion].content}</h1>
          <h4>Вопрос может иметь несколько ответов</h4>
          <Answers
            input
            options={qna[currentQuestion].options}
            handleChange={handleAnswerChange}
          />
          <ProgressBar
            next={nextQuestion}
            prev={prevQuestion}
            submit={submit}
            progress={percentage}
          />
        </>
      )}
    </>
  );
}
