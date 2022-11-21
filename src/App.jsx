import './App.scss';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import blobsLemony from './assets/blobs-lemony.svg';
import blobsBaby from './assets/blobs-baby.svg';
import Quiz from './components/Quiz';

function App() {
  // *紀錄畫面切換
  const [isStart, setIsStart] = useState(false);
  // *儲存 OTDB API 資料
  const [data, setData] = useState([]);
  // *紀錄是否為對答案狀態
  const [isCheck, setIsCheck] = useState(false);
  // *紀錄答對題數
  const [correctNum, setCorrectNum] = useState(0);
  // *紀錄遊戲次數
  const [playTimes, setPlayTimes] = useState(1);
  // *紀錄loading緩衝時間
  const [isLoading, setIsLoading] = useState(false);
  function startQuiz() {
    setIsStart(true);
  }
  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=4&category=9&type=multiple')
      .then((res) => res.json())
      .then((dataAPI) => {
        // *處理 API Data
        const handleData = dataAPI.results.map((quiz) => {
          const incorrectAnswers = quiz.incorrect_answers.map((answer) => ({
            id: nanoid(),
            value: answer,
            isCorrect: false,
            isSelect: false
          }));
          const correctAnswer = {
            id: nanoid(),
            value: quiz.correct_answer,
            isCorrect: true,
            isSelect: false
          };
          // *將所有答案存成陣列並隨機排列
          const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
          return {
            id: nanoid(),
            question: quiz.question,
            answers: allAnswers
          };
        });
        setData(handleData);
      });
  }, [playTimes]);
  // ***處理選擇答案
  function handleSelect(quizId, answerId) {
    // console.log(quizId, answerId);
    setData((prevData) => {
      const newStateOfData = prevData.map((quiz) => {
        if (quiz.id === quizId) {
          const newStateOfAnswers = quiz.answers.map((answer) => {
            return answer.id === answerId ? { ...answer, isSelect: !answer.isSelect } : answer;
          });
          const newStateOfQuiz = { ...quiz, answers: newStateOfAnswers };
          return newStateOfQuiz;
        }
        // *若if{}有return, 則else{}不需存在, 可直接把內容放if(){}外
        return quiz;
      });
      return newStateOfData;
    });
  }
  // *處理檢查答案
  function checkAnswers() {
    setIsCheck(true);
    const onlyAnswers = data.map((quiz) => quiz.answers);
    console.log(onlyAnswers);
    const correctAnswers = onlyAnswers.filter((answers) => {
      const correctId = answers.find((answer) => answer.isCorrect).id;
      const selectId = answers.find((answer) => answer.isSelect).id;
      return correctId === selectId;
    });
    setCorrectNum(correctAnswers.length);
  }
  function playAgain() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setPlayTimes((prevTimes) => prevTimes + 1);
    setIsCheck(false);
    setCorrectNum(0);
  }
  const quizElements = data.map((quiz) => (
    // *props避免在 function props 後面
    <Quiz key={quiz.id} quiz={quiz} isCheck={isCheck} handleSelect={handleSelect} />
  ));
  return (
    <main className="App">
      {isStart ? (
        <div className="questions-page">
          <img src={blobsLemony} alt="" className="img-lemony" />
          <img src={blobsBaby} alt="" className="img-baby" />
          <div className="container">
            {isLoading ? (
              <h2 className="loading">Loading...</h2>
            ) : (
              <div className="quizzes">{quizElements}</div>
            )}
          </div>
          <div className="score">
            {isCheck && <p>You scored {correctNum}/4 correct answers</p>}
            <button
              style={{
                marginLeft: isCheck ? '' : 'auto',
                marginRight: isCheck ? '' : 'auto'
              }}
              type="button"
              className="check"
              onClick={isCheck ? playAgain : checkAnswers}>
              {isCheck ? 'Play again' : 'Check answers'}
            </button>
          </div>
        </div>
      ) : (
        <div className="intro-page">
          <img src={blobsLemony} alt="" className="img-lemony" />
          <img src={blobsBaby} alt="" className="img-baby" />
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button type="button" onClick={startQuiz}>
            Start quiz
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
