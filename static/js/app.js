// Estado de la aplicación
const state = {
    userId: 'default_user',
    isConnected: false,
    currentEmotion: 'neutral',
    isTyping: false
};

// Elementos DOM
const elements = {
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    micButton: document.getElementById('micButton'),
    clearButton: document.getElementById('clearButton'),
    memoryButton: document.getElementById('memoryButton'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    emotionText: document.getElementById('emotionText'),
    emotionIndicator: document.getElementById('emotionIndicator'),
    charCount: document.getElementById('charCount'),
    memoryModal: document.getElementById('memoryModal'),
    memoryContent: document.getElementById('memoryContent'),
    avatar: document.getElementById('avatar'),
    mouth: document.getElementById('mouth')
};

// Reconocimiento de voz
let recognition = null;
let wakeWordRecognition = null;
let isRecording = false;
let isListeningForWakeWord = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Reconocimiento principal para mensajes
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        elements.messageInput.value = transcript;
        elements.charCount.textContent = transcript.length;
        autoResizeTextarea();
        
        // Enviar automáticamente después de reconocer
        setTimeout(() => {
            sendMessage();
        }, 500);
    };
    
    recognition.onend = () => {
        isRecording = false;
        elements.micButton.classList.remove('recording');
        
        // Reactivar escucha de palabra clave después de terminar
        setTimeout(() => {
            if (wakeWordRecognition && !isListeningForWakeWord) {
                startWakeWordListening();
            }
        }, 1000);
    };
    
    recognition.onstart = () => {
        isRecording = true;
        elements.micButton.classList.add('recording');
    };
    
    recognition.onerror = (event) => {
        console.error('Error de reconocimiento de voz:', event.error);
        isRecording = false;
        elements.micButton.classList.remove('recording');
        if (event.error === 'not-allowed') {
            alert('Por favor, permite el acceso al micrófono en la configuración del navegador.');
        }
    };
    
    // Reconocimiento continuo para palabra clave "Lily"
    wakeWordRecognition = new SpeechRecognition();
    wakeWordRecognition.lang = 'es-ES';
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    
    wakeWordRecognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase();
        
        // Detectar "lily" en el texto
        if (transcript.includes('lily') || transcript.includes('lili')) {
            console.log('Palabra clave detectada: Lily');
            if (!isRecording) {
                stopWakeWordListening();
                toggleRecording();
            }
        }
    };
    
    wakeWordRecognition.onend = () => {
        // Reiniciar automáticamente si debe seguir escuchando
        if (isListeningForWakeWord && !isRecording) {
            setTimeout(() => {
                try {
                    wakeWordRecognition.start();
                } catch (e) {
                    console.log('Wake word recognition ya está activo');
                }
            }, 100);
        }
    };
    
    wakeWordRecognition.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error('Error en wake word recognition:', event.error);
        }
    };
}

// Mapeo de emociones a colores y expresiones
const emotionConfig = {
    feliz: { color: '#ffd700', mouth: 'happy', emoji: '😊' },
    triste: { color: '#4a90e2', mouth: 'sad', emoji: '😢' },
    enojada: { color: '#e74c3c', mouth: 'angry', emoji: '😠' },
    emocionada: { color: '#ff6b9d', mouth: 'happy', emoji: '🤩' },
    neutral: { color: '#95a5a6', mouth: '', emoji: '😐' },
    cariñosa: { color: '#ff69b4', mouth: 'happy', emoji: '🥰' },
    juguetona: { color: '#9b59b6', mouth: 'happy', emoji: '😜' },
    preocupada: { color: '#f39c12', mouth: 'sad', emoji: '😟' },
    sorprendida: { color: '#1abc9c', mouth: 'surprised', emoji: '😲' }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    setupEventListeners();
    autoResizeTextarea();
    
    // Verificar salud cada 30 segundos
    setInterval(checkHealth, 30000);
    
    // Actualizar emoción cada 5 segundos
    setInterval(updateEmotion, 5000);
    
    // Iniciar escucha de palabra clave después de 2 segundos
    setTimeout(() => {
        if (wakeWordRecognition) {
            startWakeWordListening();
        }
    }, 2000);
});

// Configurar event listeners
function setupEventListeners() {
    elements.sendButton.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    elements.messageInput.addEventListener('input', () => {
        const length = elements.messageInput.value.length;
        elements.charCount.textContent = length;
        autoResizeTextarea();
    });
    
    elements.clearButton.addEventListener('click', clearChat);
    elements.memoryButton.addEventListener('click', showMemory);
    
    // Botón de micrófono
    if (elements.micButton && recognition) {
        elements.micButton.addEventListener('click', toggleRecording);
    } else if (elements.micButton) {
        elements.micButton.style.display = 'none';
        console.warn('Reconocimiento de voz no disponible en este navegador');
    }
    
    // Modal
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        elements.memoryModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === elements.memoryModal) {
            elements.memoryModal.style.display = 'none';
        }
    });
}

// Auto-resize textarea
function autoResizeTextarea() {
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = elements.messageInput.scrollHeight + 'px';
}

// Verificar salud del sistema
async function checkHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        state.isConnected = data.ollama_connected;
        
        if (state.isConnected) {
            elements.statusDot.classList.remove('disconnected');
            elements.statusText.textContent = 'Conectada ✨';
        } else {
            elements.statusDot.classList.add('disconnected');
            elements.statusText.textContent = 'Desconectada (Ollama offline)';
        }
    } catch (error) {
        console.error('Error verificando salud:', error);
        state.isConnected = false;
        elements.statusDot.classList.add('disconnected');
        elements.statusText.textContent = 'Error de conexión';
    }
}

// Actualizar emoción
async function updateEmotion() {
    try {
        const response = await fetch('/api/emotion');
        const data = await response.json();
        
        updateEmotionDisplay(data.emotion);
    } catch (error) {
        console.error('Error obteniendo emoción:', error);
    }
}

// Actualizar display de emoción
function updateEmotionDisplay(emotion) {
    state.currentEmotion = emotion;
    const config = emotionConfig[emotion] || emotionConfig.neutral;
    
    elements.emotionText.textContent = `${config.emoji} ${emotion}`;
    elements.emotionIndicator.style.background = `linear-gradient(135deg, ${config.color}, ${adjustColor(config.color, -20)})`;
    
    // Actualizar expresión facial
    elements.mouth.className = 'mouth ' + (config.mouth || '');
}

// Ajustar color (para gradientes)
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

// Enviar mensaje
async function sendMessage() {
    const message = elements.messageInput.value.trim();
    
    if (!message || state.isTyping) return;
    
    if (!state.isConnected) {
        showNotification('⚠️ Sistema desconectado. Por favor espera...', 'warning');
        return;
    }
    
    // Limpiar input
    elements.messageInput.value = '';
    elements.charCount.textContent = '0';
    autoResizeTextarea();
    
    // Mostrar mensaje del usuario
    addMessage('user', message);
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    state.isTyping = true;
    elements.sendButton.disabled = true;
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                user_id: state.userId
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const data = await response.json();
        
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        // Mostrar respuesta
        addMessage('assistant', data.response, data.emotion);
        
        // Actualizar emoción
        updateEmotionDisplay(data.emotion);
        
        // Reproducir audio si está disponible
        if (data.audio_url) {
            playAudio(data.audio_url);
        }
        
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        hideTypingIndicator();
        addMessage('assistant', 'Ay Mijin, algo salió mal... 😢 ¿Podrías intentar de nuevo?', 'preocupada');
    } finally {
        state.isTyping = false;
        elements.sendButton.disabled = false;
        elements.messageInput.focus();
    }
}

// Agregar mensaje al chat
function addMessage(role, content, emotion = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🌸';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const text = document.createElement('div');
    text.textContent = content;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    contentDiv.appendChild(text);
    contentDiv.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    // Remover mensaje de bienvenida si existe
    const welcomeMsg = elements.chatContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    elements.chatContainer.appendChild(messageDiv);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

// Mostrar indicador de escritura
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-message';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🌸';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    contentDiv.appendChild(typingIndicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(contentDiv);
    
    elements.chatContainer.appendChild(typingDiv);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

// Ocultar indicador de escritura
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Limpiar chat
function clearChat() {
    if (confirm('¿Estás seguro de que quieres limpiar el chat?')) {
        elements.chatContainer.innerHTML = `
            <div class="welcome-message">
                <h2>¡Hola Mijin! 💕</h2>
                <p>Soy Lily, tu asistente virtual. Puedo hablar de cualquier tema sin restricciones. ¿En qué puedo ayudarte hoy?</p>
            </div>
        `;
    }
}

// Mostrar memoria
async function showMemory() {
    elements.memoryModal.style.display = 'block';
    elements.memoryContent.innerHTML = '<p>Cargando memoria...</p>';
    
    try {
        const response = await fetch(`/api/memory/${state.userId}`);
        const data = await response.json();
        
        let html = `
            <div class="memory-section">
                <h3>📊 Resumen de Conversación</h3>
                <p>${data.conversation_summary}</p>
            </div>
            
            <div class="memory-section">
                <h3>💭 Resumen Emocional</h3>
                <p>${data.emotional_summary}</p>
            </div>
            
            <div class="memory-section">
                <h3>💬 Mensajes Recientes</h3>
        `;
        
        if (data.recent_messages.length > 0) {
            data.recent_messages.forEach(msg => {
                const roleEmoji = msg.role === 'user' ? '👤' : '🌸';
                const emotion = msg.emotion ? ` [${msg.emotion}]` : '';
                html += `
                    <p style="margin-bottom: 10px;">
                        <strong>${roleEmoji} ${msg.role}${emotion}:</strong><br>
                        ${msg.content}
                    </p>
                `;
            });
        } else {
            html += '<p>No hay mensajes recientes.</p>';
        }
        
        html += '</div>';
        
        elements.memoryContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error obteniendo memoria:', error);
        elements.memoryContent.innerHTML = '<p>Error cargando memoria. Por favor intenta de nuevo.</p>';
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Implementación simple - se puede mejorar
    alert(message);
}

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

// Reproducir audio y eliminarlo después
function playAudio(audioUrl) {
    try {
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;
        
        // Eliminar el audio después de que termine de reproducirse
        audio.addEventListener('ended', () => {
            deleteAudioFile(audioUrl);
        });
        
        // También eliminar si hay error
        audio.addEventListener('error', () => {
            console.error('Error reproduciendo audio');
            deleteAudioFile(audioUrl);
        });
        
        audio.play().catch(error => {
            console.error('Error reproduciendo audio:', error);
            deleteAudioFile(audioUrl);
        });
    } catch (error) {
        console.error('Error creando audio:', error);
    }
}

// Eliminar archivo de audio del servidor
async function deleteAudioFile(audioUrl) {
    try {
        // Extraer el nombre del archivo de la URL
        const filename = audioUrl.split('/').pop();
        
        const response = await fetch(`/api/audio/${filename}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log(`Audio eliminado: ${filename}`);
        }
    } catch (error) {
        console.error('Error eliminando audio:', error);
    }
}

// Iniciar escucha de palabra clave
function startWakeWordListening() {
    if (!wakeWordRecognition || isListeningForWakeWord) return;
    
    try {
        isListeningForWakeWord = true;
        wakeWordRecognition.start();
        console.log('🌸 Escuchando palabra clave "Lily"...');
    } catch (error) {
        console.error('Error al iniciar wake word listening:', error);
    }
}

// Detener escucha de palabra clave
function stopWakeWordListening() {
    if (!wakeWordRecognition || !isListeningForWakeWord) return;
    
    try {
        isListeningForWakeWord = false;
        wakeWordRecognition.stop();
        console.log('Palabra clave detenida');
    } catch (error) {
        console.error('Error al detener wake word listening:', error);
    }
}

// Función para activar/desactivar grabación
function toggleRecording() {
    if (!recognition) {
        alert('El reconocimiento de voz no está disponible en tu navegador. Usa Chrome o Edge.');
        return;
    }
    
    if (isRecording) {
        // Detener grabación si está activa
        recognition.stop();
        isRecording = false;
        elements.micButton.classList.remove('recording');
        elements.messageInput.value = '';
        elements.charCount.textContent = '0';
    } else {
        // Iniciar grabación
        try {
            recognition.start();
        } catch (error) {
            console.error('Error al iniciar reconocimiento:', error);
            if (error.message.includes('already started')) {
                recognition.stop();
                setTimeout(() => {
                    recognition.start();
                }, 100);
            }
        }
    }
}

// Log de inicio
console.log('🌸 Lily AI Assistant - Interfaz cargada correctamente');