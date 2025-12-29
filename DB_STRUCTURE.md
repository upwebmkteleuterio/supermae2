
# Estrutura do Banco de Dados (Espelho Local/Supabase)

## Tabelas Atuais

### 1. `app_state` (LocalStorage Mock)
Simulado via React Context para gerenciar o estado da aplicação em tempo real.

- `selectedDate`: String (YYYY-MM-DD)
- `selectedMood`: String ('light', 'strong', 'breathe')
- `childProfile`: JSON { name, needs: [] }
- `momSelfCareAgenda`: Array de Objetos de Atividades sugeridas pela IA.
- `manualMomAgenda`: Array de Objetos de Tarefas reais da mãe.
- `manualChildAgenda`: Array de Objetos de Tarefas reais do filho.
- `routines`: Array de Objetos de Rotinas (ver estrutura abaixo).
- `completedRewards`: Array de Strings (IDs das conquistas).
- `dailyMission`: Objeto { text, completed, date, moodAtTime }.
- `chatHistory`: Array de Objetos { role, text, timestamp }.

### 2. `agenda_items` (Estrutura lógica)
- `id`: UUID / Random String
- `time`: String (HH:mm)
- `title`: String
- `date`: DateString
- `category`: Enum ('Terapêutico', 'Sensorial', 'Funcional', 'Lúdico', 'Relacional', 'Cuidado', 'Outros')
- `owner`: Enum ('mãe', 'filho')
- `participantIds`: Array de Strings (IDs dos participantes)

### 3. `routines` (Estrutura lógica)
- `id`: UUID / Random String
- `name`: String (Nome da rotina)
- `subtitle`: String (Descrição curta)
- `image`: String (Caminho da imagem local ou URL)
- `icon`: String (Nome do ícone da galeria Lucide)
- `habits`: Array de Atividades (Atividades que compõem a rotina)

---
*Nota: Este arquivo será atualizado sempre que um SQL for gerado para o usuário executar no Supabase.*
