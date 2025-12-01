# Real-Time Pair Programming Web Application
## Demo Link: https://real-time-code-editor-gilt.vercel.app

A full-stack real-time collaborative code editor built with **React + Monaco Editor** on the frontend and **FastAPI + WebSockets + PostgreSQL** on the backend.  
Users can create rooms, join sessions, and collaborate live with instant synchronization of edits across all connected clients.



## How to Run Both Services

### Backend (FastAPI)

#### 1. Install dependencies
```bash
cd backend
python -m venv venv
pip install -r requirements.txt
```

#### 2. Create environment variables
##### Inside backend/, create a .env file:
```php-template
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/<dbname>
```

#### 3. (Optional) Run database migrations
```bash
alembic upgrade head
```

#### 4. Start the backend server
```bash
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000


### Frontend (React + Vite)

#### 1. Install dependencies
```bash
cd frontend
npm install
```

#### 2. Create environment variables
##### Inside frontend/, create a .env file:
```php-template
VITE_BASE_API_URL=http://localhost:8000
VITE_BASE_WS_URL=ws://localhost:8000
```

#### 3. Start the development server
```bash
npm run dev
```
frontend runs at: http://localhost:8000



## Architecture & Design Choices

### Frontend
* React (Vite) for a fast, modern development workflow.
* Monaco Editor provides a VS Code–like editing experience.
* Redux Toolkit manages global editor state and AI auto-completion.
* WebSocket client handles all real-time events (code sync, room events, future cursor sync).

### Backend
* FastAPI chosen for its async-first architecture and excellent WebSocket support.
* WebSocket endpoint broadcasts code updates to everyone in the room.
* Room manager keeps track of connected clients and the latest code state.
* PostgreSQL + SQLAlchemy Core used for persistence.
The rooms table stores:
  * id (UUID generated in backend)
  * created_at
  * last_code_state

### Why This Architecture?
* WebSockets offer low-latency, full-duplex communication suitable for collaborative editing.
* Monaco ensures familiar coding UX and strong language tooling.
* Storing only the last code state keeps persistence simple while still allowing resumable sessions.
* SQLAlchemy Core is lighter than ORM and fits this small schema well.


## What Could Be Improved With More Time

* Replace in-memory room manager with Redis for horizontal scaling and persistence.
* Add CRDT/OT (like Yjs or automerge) to handle simultaneous edits more gracefully.
* Authentication system for identifying users in a room.
* Cursor & selection synchronization so collaborators can see each other’s positions.
* Snapshots & version history for code recovery and audit.
* Automated tests for WebSockets, REST endpoints, and editor behavior.
* Docker Compose for one-command full app startup.


## Known Limitations

* No user authentication — sessions are anonymous.
* Room state is stored in memory — restarting backend loses active room state.
* No CRDT or OT — simultaneous conflicting edits may override each other.
* Only one table persists data; no history/versioning.
* AI auto-completion depends on external model latency.
* Cursor sync and presence indicators are not yet implemented.
