import '../style/Quiz.scss';

export default function Quiz({ quiz, handleSelect, isCheck }) {
  function translate(content) {
    return content
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&Eacute;/g, 'é')
      .replace(/&lrm;/g, '');
  }
  const answersElement = quiz.answers.map((answer) => {
    const getClassName = () => {
      if (isCheck) {
        if (answer.isCorrect) {
          return 'answer correct';
        }
        if (answer.isSelect) {
          return 'answer incorrect';
        }
        return 'answer check';
      }
      if (answer.isSelect) {
        return 'answer select';
      }
      return 'answer';
    };
    return (
      <button
        className={getClassName()}
        key={answer.id}
        type="button"
        onClick={() => handleSelect(quiz.id, answer.id)}>
        <p>{translate(answer.value)}</p>
      </button>
    );
  });
  return (
    <div className="quiz">
      <h3 className="question">{translate(quiz.question)}</h3>
      <div className="answers">{answersElement}</div>
    </div>
  );
}
