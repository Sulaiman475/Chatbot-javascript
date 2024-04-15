
// const chatInput = document.querySelector('.chat-input textarea')
const chatInput = document.querySelector('.input-message');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

let message;

const API_KEY = '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';
const inputHeight = chatInput.scrollHeight;
// console.log(inputHeight)

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);

    let chatContent = className === 'outgoing' ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
   
    return chatLi;
}


const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": message,
                }
            ]
        })
    }

    // Sending POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => messageElement.textContent = data.choices[0].message.content)
    .catch((error) => {
        messageElement.classList.add('error');
        messageElement.textContent = 'Something! went wrong...'
        console.log(error)
        return;
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))

}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = '';
    chatInput.style.height = `${inputHeight}px`;

    // Appending the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, 'outgoing'));

    // Auto scroll to the end of the box
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi('Thinking...', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)
}

sendChatBtn.addEventListener('click', handleChat);
chatbotCloseBtn.addEventListener('click', () => document.body.classList.toggle("show-chatbot"));
chatbotToggler.addEventListener('click', () => document.body.classList.toggle("show-chatbot"));

chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        handleChat()
    }
})