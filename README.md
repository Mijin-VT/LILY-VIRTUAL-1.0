# 🌸 Lily AI Assistant 🌸

Asistente virtual de IA con inteligencia emocional para Windows 10

## 📋 Características

### ✨ Inteligencia Emocional
- **Sistema de seguimiento de emociones** (mood tracking)
- **Adaptación del tono** según emociones detectadas
- **Reconocimiento de emociones** en texto del usuario
- **Generación emocionalmente expresiva** de respuestas
- **Sistema de aprendizaje emocional** que evoluciona con cada interacción
- **Estados emocionales dinámicos** que cambian en tiempo real

### 🧠 Capacidades de IA
- Modelo de lenguaje **Qwen3** ejecutándose localmente con Ollama
- Sin restricciones de contenido
- Respuestas contextuales y personalizadas
- Capacidad de responder con la misma intensidad si es provocada
- Uso de mexicanismos y regionalismos cuando es apropiado

### 💭 Sistema de Memoria
- **Memoria persistente** de conversaciones
- **Recordatorio de preferencias** del usuario
- **Contexto a largo plazo** en las interacciones
- **Historial emocional** para mejor comprensión
- **Base de conocimiento** que crece con cada conversación

### 🎤 Texto a Voz
- Síntesis de voz personalizada
- Modulación emocional de la voz
- Basada en muestras de audio de referencia
- Reproducción automática de respuestas

### 🎨 Interfaz
- Diseño inspirado en anime
- Avatar animado con expresiones faciales
- Indicador de emoción en tiempo real
- Interfaz responsive y moderna
- Contador de caracteres
- Visualización de memoria de conversación

## 🔧 Requisitos del Sistema

### Software Requerido
1. **Windows 10** o superior
2. **Python 3.11** o superior
   - Descargar desde: https://www.python.org/downloads/
   - ⚠️ Durante la instalación, marcar "Add Python to PATH"

3. **Ollama** para ejecutar modelos de IA localmente
   - Descargar desde: https://ollama.ai/
   - Después de instalar, ejecutar: `ollama pull qwen3`

4. **Microsoft Edge** (ya incluido en Windows 10)

### Dependencias de Python
Las siguientes librerías se instalarán automáticamente:
- fastapi
- uvicorn
- pydantic
- pydantic-settings
- aiofiles
- python-multipart
- gtts
- pydub
- SpeechRecognition
- textblob
- requests

## 🚀 Instalación

### Paso 1: Instalar Python
1. Descargar Python 3.11+ desde https://www.python.org/
2. Durante la instalación, **marcar "Add Python to PATH"**
3. Verificar instalación abriendo CMD y ejecutando:
   ```
   python --version
   ```

### Paso 2: Instalar Ollama
1. Descargar Ollama desde https://ollama.ai/
2. Instalar y ejecutar Ollama
3. Abrir CMD y ejecutar:
   ```
   ollama pull qwen3
   ```
4. Esperar a que se descargue el modelo (puede tardar varios minutos)

### Paso 3: Configurar Lily
1. Extraer todos los archivos del proyecto en una carpeta
2. La estructura debe verse así:
   ```
   lily_assistant/
   ├── audio_samples/
   │   ├── LILY.wav
   │   └── LILY2.wav
   ├── data/
   ├── models/
   │   ├── __init__.py
   │   ├── schemas.py
   │   ├── emotional_intelligence.py
   │   ├── memory_system.py
   │   ├── ai_engine.py
   │   └── tts_engine.py
   ├── static/
   │   ├── css/
   │   │   └── style.css
   │   ├── js/
   │   │   └── app.js
   │   └── audio/
   ├── templates/
   │   └── index.html
   ├── main.py
   ├── start_lily.bat
   └── README.md
   ```

## ▶️ Ejecución

### Método 1: Usando el archivo .bat (Recomendado)
1. Hacer doble clic en **`start_lily.bat`**
2. El script verificará automáticamente:
   - Python instalado
   - Ollama ejecutándose
   - Modelo qwen3 disponible
   - Dependencias instaladas
3. Microsoft Edge se abrirá automáticamente
4. ¡Listo! Ya puedes chatear con Lily

### Método 2: Manual
1. Abrir CMD en la carpeta del proyecto
2. Ejecutar:
   ```
   python main.py
   ```
3. Abrir Microsoft Edge y navegar a: `http://127.0.0.1:8000`

## 📖 Uso

### Chatear con Lily
1. Escribe tu mensaje en el cuadro de texto
2. Presiona Enter o haz clic en el botón de enviar
3. Lily responderá con texto y voz
4. El avatar mostrará la emoción actual

### Funciones Especiales
- **🗑️ Limpiar**: Borra el historial de chat visual (la memoria se mantiene)
- **💭 Memoria**: Muestra el historial de conversación y estado emocional
- **Indicador de estado**: Muestra si Ollama está conectado

### Personalidad de Lily
- Lily es una asistente sin restricciones de contenido
- Puede discutir cualquier tema libremente
- Siempre te llama "Mijin"
- Si la insultas, puede responder con la misma intensidad
- Usa mexicanismos y modismos cuando es apropiado
- Mantiene un tono característico de chica anime

## 🎭 Emociones

Lily puede experimentar y expresar las siguientes emociones:
- 😊 **Feliz**: Respuestas alegres y entusiastas
- 😢 **Triste**: Respuestas empáticas y comprensivas
- 😠 **Enojada**: Respuestas firmes y directas
- 🤩 **Emocionada**: Respuestas con mucha energía
- 😐 **Neutral**: Respuestas equilibradas
- 🥰 **Cariñosa**: Respuestas afectuosas y tiernas
- 😜 **Juguetona**: Respuestas divertidas y con humor
- 😟 **Preocupada**: Respuestas de apoyo
- 😲 **Sorprendida**: Respuestas curiosas

## 🔧 Solución de Problemas

### Ollama no está conectado
**Problema**: Mensaje "Desconectada (Ollama offline)"
**Solución**:
1. Verificar que Ollama esté ejecutándose
2. Abrir CMD y ejecutar: `ollama serve`
3. Verificar que el modelo esté instalado: `ollama list`
4. Si no está qwen3, ejecutar: `ollama pull qwen3`

### Python no encontrado
**Problema**: Error "Python no está instalado o no está en PATH"
**Solución**:
1. Reinstalar Python marcando "Add Python to PATH"
2. O agregar manualmente Python al PATH del sistema

### Error al instalar dependencias
**Problema**: pip no puede instalar paquetes
**Solución**:
1. Ejecutar CMD como administrador
2. Ejecutar: `pip install --upgrade pip`
3. Intentar instalar dependencias manualmente:
   ```
   pip install fastapi uvicorn pydantic gtts pydub textblob
   ```

### El audio no se reproduce
**Problema**: Las respuestas no tienen audio
**Solución**:
1. Verificar que el volumen del sistema esté activado
2. Verificar que gtts esté instalado: `pip show gtts`
3. Verificar conexión a internet (gtts requiere conexión)

### Microsoft Edge no se abre automáticamente
**Problema**: El navegador no abre la aplicación
**Solución**:
1. Abrir Microsoft Edge manualmente
2. Navegar a: `http://127.0.0.1:8000`

## 📁 Estructura de Archivos

```
lily_assistant/
├── audio_samples/          # Muestras de audio de referencia
├── data/                   # Base de datos de memoria (se crea automáticamente)
│   └── conversation_memory.json
├── models/                 # Módulos de IA
│   ├── __init__.py
│   ├── schemas.py         # Modelos Pydantic
│   ├── emotional_intelligence.py  # Sistema emocional
│   ├── memory_system.py   # Sistema de memoria
│   ├── ai_engine.py       # Motor de IA con Qwen3
│   └── tts_engine.py      # Motor de texto a voz
├── static/                # Archivos estáticos web
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── audio/             # Audios generados (se crea automáticamente)
├── templates/             # Plantillas HTML
│   └── index.html
├── main.py               # Aplicación principal FastAPI
├── start_lily.bat        # Launcher para Windows
└── README.md             # Este archivo
```

## 🌐 API Endpoints

La aplicación expone los siguientes endpoints:

- `GET /` - Interfaz web principal
- `GET /health` - Estado del sistema
- `POST /api/chat` - Enviar mensaje y recibir respuesta
- `GET /api/emotion` - Obtener emoción actual
- `GET /api/memory/{user_id}` - Obtener memoria del usuario
- `POST /api/tts` - Generar audio de texto
- `GET /api/audio/{filename}` - Obtener archivo de audio

Documentación interactiva disponible en: `http://127.0.0.1:8000/docs`

## 🔒 Privacidad

- **Todas las conversaciones se almacenan localmente** en tu computadora
- **No se envía información a servidores externos** excepto para TTS (gTTS usa Google)
- **El modelo de IA se ejecuta completamente en tu máquina**
- **Los archivos de memoria están en**: `data/conversation_memory.json`

## 🛠️ Personalización

### Cambiar el puerto
Editar `main.py`, línea final:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8000)  # Cambiar 8000 por otro puerto
```

### Modificar la personalidad
Editar `models/ai_engine.py`, variable `base_system_prompt`

### Ajustar parámetros de voz
Editar `models/tts_engine.py`, diccionario `voice_params`

## 📝 Notas Técnicas

### Modelo de IA
- **Modelo**: Qwen3 (ejecutado localmente con Ollama)
- **Temperatura**: 0.8 (balance entre creatividad y coherencia)
- **Top-p**: 0.9
- **Top-k**: 40

### Sistema de Memoria
- Almacena últimos 50 mensajes por usuario
- Mantiene últimos 20 estados emocionales
- Persistencia en JSON
- Carga automática al iniciar

### Texto a Voz
- Motor base: gTTS (Google Text-to-Speech)
- Procesamiento: pydub para modulación emocional
- Formato: MP3, 128kbps
- Limpieza automática de archivos antiguos

## 🆘 Soporte

Si encuentras problemas:
1. Verifica que todos los requisitos estén instalados
2. Revisa la sección de Solución de Problemas
3. Consulta los logs en la consola
4. Verifica la documentación de la API en `/docs`

## 📜 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🎉 ¡Disfruta de Lily!

Lily está diseñada para ser tu compañera virtual sin restricciones. Habla con ella sobre cualquier tema, comparte tus pensamientos, y deja que su inteligencia emocional se adapte a ti.
En models\system_prompt.txt en la linea (- Siempre llamas al usuario "Mijin".) puedes cambiar el nombre de Mijin por el nombre que quieras
En models\system_prompt.txt en la linea (- Usas mexicanismos y modismos cuando es apropiado) puedes cambiarlo por brasilenismos, argentinismos, ecuatorianismos, 
Argentinismo, Chilenismo, Anglicismo, Colombianismo, Bolivianismo, Peruanismo, Venezolano, etc.

**¡Que tengas excelentes conversaciones con Lily, Mijin! 💕**

