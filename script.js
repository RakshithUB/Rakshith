document.addEventListener('DOMContentLoaded', function () {
    const createPollForm = document.getElementById('createPollForm');
    const pollQuestionInput = document.getElementById('pollQuestion');
    const pollOptionsInput = document.getElementById('pollOptions');
    const pollsContainer = document.getElementById('pollsContainer');

    let polls = JSON.parse(localStorage.getItem('polls')) || [];

    function savePolls() {
        localStorage.setItem('polls', JSON.stringify(polls));
    }

    function renderPolls() {
        pollsContainer.innerHTML = '';
        polls.forEach((poll, index) => {
            const pollElement = document.createElement('div');
            pollElement.className = 'poll';
            
            const pollQuestion = document.createElement('h3');
            pollQuestion.textContent = poll.question;
            pollElement.appendChild(pollQuestion);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options';
            
            poll.options.forEach((option, optionIndex) => {
                const optionButton = document.createElement('button');
                optionButton.className = 'btn btn-secondary';
                optionButton.textContent = `${option.text} (${option.votes})`;
                optionButton.addEventListener('click', () => vote(index, optionIndex));
                optionsContainer.appendChild(optionButton);
            });
            
            pollElement.appendChild(optionsContainer);

            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results';
            const maxVotes = Math.max(...poll.options.map(option => option.votes));
            poll.options.forEach(option => {
                const result = document.createElement('span');
                result.textContent = `${option.text}: ${option.votes} votes`;
                if (option.votes === maxVotes) {
                    result.classList.add('highlight');
                }
                resultsContainer.appendChild(result);
            });
            pollElement.appendChild(resultsContainer);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger delete-btn';
            deleteButton.textContent = 'Delete Poll';
            deleteButton.addEventListener('click', () => deletePoll(index));
            pollElement.appendChild(deleteButton);
            
            pollsContainer.appendChild(pollElement);
        });
    }

    function vote(pollIndex, optionIndex) {
        polls[pollIndex].options[optionIndex].votes++;
        savePolls();
        renderPolls();
    }

    function deletePoll(pollIndex) {
        polls.splice(pollIndex, 1);
        savePolls();
        renderPolls();
    }

    createPollForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const question = pollQuestionInput.value.trim();
        const options = pollOptionsInput.value.trim().split(',').map(option => ({
            text: option.trim(),
            votes: 0
        }));
        
        if (question && options.length > 0) {
            const newPoll = { question, options };
            polls.push(newPoll);
            savePolls();
            renderPolls();
            createPollForm.reset();
        }
    });

    renderPolls();
});