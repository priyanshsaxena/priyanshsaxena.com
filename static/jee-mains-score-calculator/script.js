const responseSheet = document.getElementById('response-sheet');
const sheetDoc = document.implementation.createHTMLDocument("Response-Sheet").documentElement;
responseSheet.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = (evt) => {
            var text = evt.target.result;
            sheetDoc.innerHTML = text;
        }
        reader.readAsText(file);
    } else {
        document.querySelector(".response-sheet-content").textContent = "Failed to load response-sheet";
    }
});

const answerKey = document.getElementById('answer-key');
const keyDoc = document.implementation.createHTMLDocument("Answer-Key").documentElement;
answerKey.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = (evt) => {
            var text = evt.target.result;
            keyDoc.innerHTML = text;
        }
        reader.readAsText(file);
    } else {
        document.querySelector(".answer-key-content").textContent = "Failed to load answer-key";
    }
});

const doTheMath = () => {

    var scores = new Map();
    ["Physics", "Chemistry", "Mathematics", "total-score"].forEach((subject) => { scores.set(subject, 0); } );

    var answerKeyRows = keyDoc.getRootNode().getElementById("ctl00_LoginContent_grAnswerKey").getElementsByTagName("tr")
    var i = 1;
    var count = 0;
    var answerMap = new Map();
    while (count < 90) {
        var answerDetails = answerKeyRows[i].getElementsByTagName("span");
        var quesType = answerDetails[0].textContent;
        var questionNo = answerDetails[1].textContent;
        var correctAnswer = answerDetails[2].textContent;
        answerMap.set(questionNo, { type : quesType, answer : correctAnswer });
        if(quesType === "Objective") i++;
        i++;
        count++;
    }

    var sections = sheetDoc.getElementsByClassName("section-cntnr");
    for(var i = 0 ; i < sections.length ; i++) {
        var section = sections[i];
        var sectionName = section.getElementsByClassName("section-lbl")[0].children[1].textContent;
        var subject = sectionName.split(" ")[0];
        var questions = section.getElementsByClassName("questionPnlTbl");
        for(var j = 0 ; j < questions.length ; j++) {
            var question = questions[j];
            var questionRowDetails = question.getElementsByClassName("questionRowTbl")[0].getElementsByTagName("tr")
            var questionLabel = questionRowDetails[1].children[0].textContent
            var questionDetails = question.getElementsByClassName("menu-tbl")[0].getElementsByTagName("tr")
            var questionType = questionDetails[0].children[1].textContent
            var questionId = questionDetails[1].children[1].textContent
            var status = questionType == "MCQ" ? questionDetails[6].children[1].textContent : questionDetails[2].children[1].textContent;
            var markedAnswer = questionType == "MCQ" ? questionDetails[7].children[1].textContent : questionRowDetails[4].children[1].textContent
            var correctAnswer = getCorrectAnswer(questionDetails, answerMap.get(questionId).answer);
            var scoreForThisQuestion = 0;
            if(correctAnswer === markedAnswer) scoreForThisQuestion = 4;
            else if(questionType === "MCQ" && !isNaN(markedAnswer) && !isNaN(correctAnswer)) scoreForThisQuestion--;
            scores.set("total-score", scores.get("total-score") + scoreForThisQuestion);
            scores.set(subject, scores.get(subject) + scoreForThisQuestion);
            appendToTable([sectionName + " " + questionLabel, status, correctAnswer, markedAnswer]);
        }
    }
    scores.forEach((value, key) => {
        document.querySelector("#" + key).textContent = value;
    });
}

const getCorrectAnswer = (questionDetails, answer) => {
    if(questionDetails[0].children[1].textContent == "SA") return answer;
    for(var i = 2 ; i < 6 ; i++) {
        if(answer === questionDetails[i].children[1].textContent) return (i - 1).toString();
    }
    return answer;
}

const appendToTable = (tableRowContents) => {
    var newRow = document.getElementById("responses-table-body").insertRow()
    for(var i = 0 ; i < 4 ; i++) {
        var newCell = newRow.insertCell();
        newCell.appendChild(document.createTextNode(tableRowContents[i]));
    }
    newRow.setAttribute('class', findCorrectness(tableRowContents.slice(1, 4)));
}

const findCorrectness = (answerDetails) => {
    if(answerDetails[0] === "Answered") {
        if(answerDetails[1] === answerDetails[2]) return "table-success";
        return "table-danger";
    }
    return "";
}