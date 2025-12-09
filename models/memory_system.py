import json
import os
from typing import List, Dict, Optional
from datetime import datetime
from models.schemas import ConversationMemory, EmotionalState


class MemorySystem:
    """Sistema de memoria persistente para recordar conversaciones y preferencias"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.memory_file = os.path.join(data_dir, "conversation_memory.json")
        self.memories: Dict[str, ConversationMemory] = {}
        self.load_memories()
    
    def load_memories(self):
        """Carga las memorias desde el archivo JSON"""
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for user_id, memory_data in data.items():
                        self.memories[user_id] = ConversationMemory(**memory_data)
            except Exception as e:
                print(f"Error cargando memorias: {e}")
                self.memories = {}
        else:
            self.memories = {}
    
    def save_memories(self):
        """Guarda las memorias en el archivo JSON"""
        try:
            os.makedirs(self.data_dir, exist_ok=True)
            data = {}
            for user_id, memory in self.memories.items():
                data[user_id] = memory.model_dump(mode='json')
            
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        except Exception as e:
            print(f"Error guardando memorias: {e}")
    
    def get_or_create_memory(self, user_id: str) -> ConversationMemory:
        """Obtiene o crea una memoria para un usuario"""
        if user_id not in self.memories:
            self.memories[user_id] = ConversationMemory(user_id=user_id)
        return self.memories[user_id]
    
    def add_message(self, user_id: str, role: str, content: str, emotion: Optional[str] = None):
        """Agrega un mensaje a la memoria"""
        memory = self.get_or_create_memory(user_id)
        
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "emotion": emotion
        }
        
        memory.messages.append(message)
        memory.last_interaction = datetime.now()
        
        # Mantener solo los últimos 50 mensajes para no saturar
        if len(memory.messages) > 50:
            memory.messages = memory.messages[-50:]
        
        self.save_memories()
    
    def add_emotional_state(self, user_id: str, emotional_state: EmotionalState):
        """Agrega un estado emocional al historial"""
        memory = self.get_or_create_memory(user_id)
        memory.emotional_history.append(emotional_state)
        
        # Mantener solo los últimos 20 estados emocionales
        if len(memory.emotional_history) > 20:
            memory.emotional_history = memory.emotional_history[-20:]
        
        self.save_memories()
    
    def get_conversation_context(self, user_id: str, max_messages: int = 10) -> List[Dict]:
        """Obtiene el contexto de conversación reciente"""
        memory = self.get_or_create_memory(user_id)
        return memory.messages[-max_messages:] if memory.messages else []
    
    def update_preference(self, user_id: str, key: str, value: any):
        """Actualiza una preferencia del usuario"""
        memory = self.get_or_create_memory(user_id)
        memory.user_preferences[key] = value
        self.save_memories()
    
    def get_preference(self, user_id: str, key: str, default=None):
        """Obtiene una preferencia del usuario"""
        memory = self.get_or_create_memory(user_id)
        return memory.user_preferences.get(key, default)
    
    def get_emotional_summary(self, user_id: str) -> str:
        """Obtiene un resumen del historial emocional"""
        memory = self.get_or_create_memory(user_id)
        
        if not memory.emotional_history:
            return "No hay historial emocional previo."
        
        recent_emotions = memory.emotional_history[-5:]
        emotion_counts = {}
        
        for state in recent_emotions:
            emotion = state.emotion
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        dominant_emotion = max(emotion_counts, key=emotion_counts.get)
        
        return f"Emoción dominante reciente: {dominant_emotion}"
    
    def get_conversation_summary(self, user_id: str) -> str:
        """Obtiene un resumen de la conversación"""
        memory = self.get_or_create_memory(user_id)
        
        if not memory.messages:
            return "Primera conversación con el usuario."
        
        total_messages = len(memory.messages)
        last_interaction = memory.last_interaction
        
        return f"Total de mensajes: {total_messages}. Última interacción: {last_interaction.strftime('%Y-%m-%d %H:%M')}"

