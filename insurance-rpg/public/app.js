let persona = '';
let conversation = [];
let turn = 0;

async function startGame() {
    persona = document.getElementById('persona').value;
    // Start game with persona and get initial message from OpenAI
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: persona}),
    });
    const data = await response.json();
    conversation.push({role: 'client', content: data.choices[0].text});
    displayConversation();
    turn++;
}

async function sendMessage() {
    if (turn < 4) {
        const message = document.getElementById('message').value;
        conversation.push({role: 'player', content: message});
        displayConversation();

        if (turn < 3) {
            // Get response from OpenAI
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt: conversation.map(c => `${c.role}: ${c.content}`).join('\n')}),
            });
            const data = await response.json();
            conversation.push({role: 'client', content: data.choices[0].text});
            displayConversation();
        }
        turn++;
    }
    if (turn === 4) {
        // Get final evaluation from OpenAI
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: `Evaluate the following conversation:\n${conversation.map(c => `${c.role}: ${c.content}`).join('\n')}`}),
        });
        const data = await response.json();
        conversation.push({role: 'evaluation', content: data.choices[0].text});
        displayConversation();
    }
}

function displayConversation() {
    const chat = document.getElementById('chat');
    chat.innerHTML = conversation.map(c => `<p><b>${c.role}</b>: ${c.content}</p>`).join('');
}
