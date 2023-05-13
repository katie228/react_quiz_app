import _ from "lodash";
import { useHistory, useParams } from "react-router-dom";
import useAnswers from "../../hooks/useAnswers";
import Analysis from "../Analysis";
import Summary from "../Summary";

export default function Result() {
  const { id } = useParams();
  const { location } = useHistory();
  const { state } = location;
  const { qna } = state;

  const { loading, error, answers } = useAnswers(id);

  function calculate() {
    let score = 0;
    let totalPoints = 0;

    answers.forEach((question, index1) => {
      let correctIndexes = [],
        checkedIndexes = [];

      question.options.forEach((option, index2) => {
        if (option.correct) correctIndexes.push(index2);
        if (qna[index1].options[index2].checked) {
          checkedIndexes.push(index2);
          option.checked = true;
        }
      });

      if (_.isEqual(correctIndexes, checkedIndexes)) {
        score += parseInt(question.points, 10);
      }

      totalPoints += parseInt(question.points, 10);
    });

    return { score, totalPoints };
  }

  const { score, totalPoints } = calculate();

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка!</div>}

      {answers && answers.length > 0 && (
        <>
          <Summary
            score={score}
            totalPoints={totalPoints}
            totalQuestions={answers.length}
          />
          <Analysis answers={answers} />
        </>
      )}
    </>
  );
}
