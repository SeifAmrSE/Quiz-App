// select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// function for api
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // create bullets + set questions count
      createBullets(qCount);

      // add question data
      addQuestionData(questionsObject[currentIndex], qCount);

      // start countdown
      countdown(3, qCount);

      // click on submit
      submitButton.onclick = () => {
        // get the right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // increase index
        currentIndex++;

        // check answer
        checkAnswer(theRightAnswer, qCount);

        // remove old question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add question data
        addQuestionData(questionsObject[currentIndex], qCount);

        // handle bullets class
        handleBullets();

        // start countdown
        clearInterval(countdownInterval);
        countdown(3, qCount);

        // show results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);

  myRequest.send();
}

// function
getQuestions();

// function
function createBullets(num) {
  countSpan.innerHTML = num;

  // create bullets
  for (let i = 0; i < num; i++) {
    // create bullet
    let theBullet = document.createElement("span");

    // check if it is first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // append bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

// function
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj.title);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append the h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      // add class to main div
      mainDiv.className = "answer";

      // create radio input
      let radioInput = document.createElement("input");

      // add type + name + id + data attribute
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // make first option selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlFor = `answer_${i}`;

      // create label text
      let theLabdlText = document.createTextNode(obj[`answer_${i}`]);

      // add text to label
      theLabel.appendChild(theLabdlText);

      // add label + input to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // append all divs to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

// function
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

// function
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

// function
function showResults(count) {
  let theResults;

  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="excellent">Excellent</span>, All Answers Is right.`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
  }
}

// function
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
