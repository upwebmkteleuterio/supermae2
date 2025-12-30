
# Estrutura do Banco de Dados (Espelho Local/Supabase)

## Tabelas Atuais

### 1. `app_state` (LocalStorage Mock)
Simulado via React Context para gerenciar o estado da aplicação em tempo real.

- `selectedDate`: String (YYYY-MM-DD)
- `selectedMood`: String ('light', 'strong', 'breathe')
- `childProfile`: JSON { name, needs: [] }
- `momSelfCareAgenda`: Array de Objetos de Atividades sugeridas pela IA.
- `manualMomAgenda`: Array de Objetos de Tarefas da mãe.
- `manualChildAgenda`: Array de Objetos de Tarefas do filho.
- `routines`: Array de Objetos de Rotinas.
- `moodHistory`: Objeto Record<String, String[]> (Data -> IDs de Sentimentos).
- `habitCompletions`: Objeto Record<String, String[]> (Data -> IDs de Hábitos concluídos).
- `chatHistory`: Array de Objetos { role, text, timestamp }.
- `userProfile`: Objeto com dados cadastrais e preferências.

### 2. `agenda_items` (Estrutura lógica)
*Nota: Atualizações em tarefas com o mesmo ID em listas diferentes (mãe/filho) são síncronas.*

- `id`: UUID / Random String (Identificador único atômico)
- `time`: String (HH:mm)
- `title`: String
- `date`: DateString (YYYY-MM-DD)
- `category`: Enum ('Terapêutico', 'Sensorial', 'Funcional', 'Lúdico', 'Relacional', 'Cuidado', 'Outros')
- `owner`: Enum ('mãe', 'filho')
- `participantIds`: Array de Strings (Contém 'mom' e/ou IDs dos filhos para espelhamento)
- `completed`: Boolean (Status compartilhado se o ID for o mesmo)
- `reminder`: Boolean
- `description`: String (Observações e recorrência)

### 3. `routines` (Estrutura lógica)
- `id`: UUID / Random String
- `name`: String (Nome da rotina)
- `subtitle`: String (Descrição curta)
- `icon`: String (ID do ícone da galeria)
- `habits`: Array de Activity (Atividades que compõem a rotina)

---
*Nota: Este arquivo serve como referência para a integridade do estado global da aplicação.*
