const chatState = {
    step: 0,
    data: {},
    isOpen: false
};

const chatQuestions = [
    {
        id: 'start',
        text: "Namaste! Welcome to Khenat Hospital. I'm your virtual assistant. How can I help you today?",
        options: ["Book Appointment", "Services Information", "Emergency Contact"]
    },
    {
        id: 'name',
        text: "I can definitely help with that. May I know your full name?",
        type: 'text'
    },
    {
        id: 'dept',
        text: "nice to meet you, {name}. Which department would you like to consult?",
        options: ["General", "Gynecology", "Orthopedics", "Diagnostics"]
    },
    {
        id: 'date',
        text: "When would you like to visit us? (Approximate date is fine)",
        type: 'text'
    },
    {
        id: 'phone',
        text: "Please share your 10-digit mobile number so we can confirm the slot.",
        type: 'text'
    },
    {
        id: 'confirm',
        text: "Thank you! I have drafted an appointment request for you:\n\n👤 {name}\n🏥 {dept}\n📅 {date}\n📞 {phone}\n\nClick below to send this request formally.",
        options: ["Send Request via Email/WhatsApp", "Edit Details"]
    }
];

function toggleChat() {
    chatState.isOpen = !chatState.isOpen;
    const windowEl = document.getElementById('chat-window');

    if (chatState.isOpen) {
        windowEl.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
        windowEl.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    } else {
        windowEl.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
        windowEl.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
    if (chatState.isOpen && document.getElementById('chat-messages').children.length === 0) {
        // Start conversation if empty
        setTimeout(() => botReply(chatQuestions[0]), 500);
    }
}

function addMessage(text, sender = 'bot') {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function addOptions(options) {
    const container = document.getElementById('chat-messages');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options-container';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleUserResponse(opt);
        optionsDiv.appendChild(btn);
    });

    container.appendChild(optionsDiv);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

function botReply(questionObj) {
    showTyping();
    setTimeout(() => {
        hideTyping();
        let finalText = questionObj.text.replace('{name}', chatState.data.name || 'Friend')
            .replace('{dept}', chatState.data.dept)
            .replace('{date}', chatState.data.date)
            .replace('{phone}', chatState.data.phone);

        addMessage(finalText, 'bot');

        if (questionObj.options) {
            addOptions(questionObj.options);
        }
    }, 1000); // Simulated delay
}

function handleUserResponse(response) {
    // Remove options buttons to clean up
    const oldOptions = document.querySelectorAll('.options-container');
    if (oldOptions.length > 0) oldOptions[oldOptions.length - 1].remove();

    addMessage(response, 'user');

    // Logic Flow
    if (chatState.step === 0) {
        if (response.includes("Book")) {
            chatState.step = 1;
            botReply(chatQuestions[1]);
        } else if (response.includes("Emergency")) {
            addMessage("For emergencies, please call us immediately at 020-25448451.", 'bot');
        } else {
            addMessage("We offer General Medicine, Gynecology, Orthopedics, and Diagnostics. Please scroll to our Services section for more details.", 'bot');
            addOptions(["Book Appointment", "Back to Menu"]);
        }
    } else if (chatState.step === 1) { // Got Name
        chatState.data.name = response;
        chatState.step = 2;
        botReply(chatQuestions[2]);
    } else if (chatState.step === 2) { // Got Dept
        chatState.data.dept = response;
        chatState.step = 3;
        botReply(chatQuestions[3]);
    } else if (chatState.step === 3) { // Got Date
        chatState.data.date = response;
        chatState.step = 4;
        botReply(chatQuestions[4]);
    } else if (chatState.step === 4) { // Got Phone
        chatState.data.phone = response;
        chatState.step = 5;
        botReply(chatQuestions[5]);
    } else if (chatState.step === 5) { // Confirmation
        if (response.includes("Send")) {
            // Re-use main.js logic formatting
            const subject = encodeURIComponent(`Chat Appt: ${chatState.data.name}`);
            const body = encodeURIComponent(`Name: ${chatState.data.name}\nDept: ${chatState.data.dept}\nDate: ${chatState.data.date}\nPhone: ${chatState.data.phone}\n\nVia Chatbot.`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            addMessage("Great! I've opened your email client. Please hit Send.", 'bot');
        } else {
            chatState.step = 0; // Restart
            botReply({ text: "Okay, let's start over.", options: ["Book Appointment"] });
        }
    }
}

// Input handler
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim() !== "") {
        handleUserResponse(this.value.trim());
        this.value = '';
    }
});

document.getElementById('chat-send').addEventListener('click', function () {
    const input = document.getElementById('chat-input');
    if (input.value.trim() !== "") {
        handleUserResponse(input.value.trim());
        input.value = '';
    }
});
