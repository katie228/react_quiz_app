import React from "react";
import hello1 from "../../assets/images/hello1.png";
import hello2 from "../../assets/images/hello2.png";
import hello3 from "../../assets/images/hello3.png";

import "../../styles/Hello1.css";

export default function Hello() {
  return (
    <body class="hello-page">
      <div className="container">
        <div className="row">
          <div className="column">
            <img src={hello1} alt="Изображение 1" />
            <p className="caption">Удобный формат тестирования</p>
          </div>
          <div className="column">
            <img src={hello2} alt="Изображение 2" />
            <p className="caption">Баллы и прогресс</p>
          </div>
          <div className="column">
            <img src={hello3} alt="Изображение 3" />
            <p className="caption">Улучшенное усвоение материала</p>
          </div>
        </div>
        <div className="text-container">
          <h2>О нашем приложении</h2>
          <p>
            Наше веб-приложение предлагает удобное и эффективное тестирование
            для повышения интереса и усвоения лекционного материала. Вы можете
            проходить тесты по различным темам, получать баллы заправильные
            ответы и отслеживать свой прогресс.
          </p>
          <p>
            Мы предоставляем детальную статистику, чтобы помочь вам оценить свои
            успехи и обнаружить слабые места для дальнейшего изучения. Наше
            приложение поможет вам лучше усвоить дисциплину и подготовиться к
            экзаменам.
          </p>
          <p>
            Приложение также поддерживает возможность создания пользовательских
            тестов, что позволяет преподавателям создавать собственные вопросы и
            тесты для учебных целей.
          </p>
        </div>
      </div>
    </body>
  );
}
