const apiUrl =
  'https://opentdb.com/api.php?amount=15&category=18&difficulty=medium&type=multiple';

let questions = [];
let currentIndex = 0;
let score = 0;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    questions = data.results.map((fetchedQuestionDetails) => {
      return {
        question: fetchedQuestionDetails.question,
        correct_answer: fetchedQuestionDetails.correct_answer,
        all_answers: shuffle([
          fetchedQuestionDetails.correct_answer,
          ...fetchedQuestionDetails.incorrect_answers,
        ]),
      };
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
  }
}

const displayQuestion = (i) => {
  const currentQuestion = questions[i];
  const questionNumber = document.querySelector('#question-number');
  const questionText = document.querySelector('#question-text');
  const options = document.querySelector('#options-list');

  questionNumber.innerHTML = `Question ${i + 1}/${questions.length}`;
  questionText.innerHTML = currentQuestion.question;
  options.innerHTML = questions[i].all_answers
    .map((answer) => {
      return `
      <li style="width: 100%; display: flex; justify-content: stretch;">
        <label class="flex items-center w-full cursor-pointer">
          <input type="radio" name="option" value="${answer}" class="peer hidden" />
          <span class="flex-1 py-2 px-4 rounded border border-white peer-checked:bg-blue-600 transition text-center">
            ${answer}
          </span>
        </label>
      </li>
    `;
    })
    .join('');
};

const nextButton = document.querySelector('#next-btn');
nextButton.addEventListener('click', () => {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert('Please select an answer');
    return;
  }
  checkAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    displayQuestion(currentIndex);
  } else {
    alert(`Quiz complete!, You scored ${score} out of ${questions.length}`);
    const questionNumber = document.querySelector('#question-number');
    const questionText = document.querySelector('#question-text');
    questionNumber.innerHTML = 'Getting ready for the next quiz...';
    questionText.innerHTML = 'Get ready to go again!';
    location.reload();
  }
});

const prevButton = document.querySelector('#prev-btn');
prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayQuestion(currentIndex);
  } else {
    alert("You can't go back anymore!");
  }
});

const checkAnswer = () => {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption.value !== questions[currentIndex].correct_answer) {
    alert(
      `Wrong! The correct answer was: ${questions[currentIndex].correct_answer}`
    );
  } else {
    alert('Correct!');
    score++;
  }
};

const startQuiz = async () => {
  await fetchQuestions();
  if (questions.length === 0) {
    alert('No questions available. Please try again later.');
    return;
  }
  displayQuestion(currentIndex);
};

startQuiz();
