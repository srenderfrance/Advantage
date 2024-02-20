
async function reviewByTopic () {
    try {
        const topic = document.querySelector('#subjectToReview').value;
        console.log(topic);

        const response = await fetch('student/reviewByTopic', {method: 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({topic: topic}),
    });
    } catch (error) {
        console.log(error);
    }
};




document.querySelector('#selectByTopic').addEventListener('click', reviewByTopic);