#### 🦷 Voice AI Receptionist – Smart Dental Assistant

An intelligent full-stack web application built for a four-clinic dental brand in Mumbai.
The system acts as an AI receptionist capable of answering treatment queries, booking appointments, adding them to Google Calendar, and sending spoken responses via text-to-speech (TTS).

---

### 🧠 Features

✅ Conversational AI assistant powered by Google Gemini API

✅ Speech recognition (mic) – talk to the AI receptionist

✅ Smart treatment queries – understands user intent naturally

✅ Appointment booking with clinic, treatment & time slot

✅ Auto-creates Google Calendar events via service account

✅ Text-to-Speech (TTS) for voice-enabled responses

✅ Frontend & backend fully deployable (Netlify + Render)

---

### 🏗️ Tech Stack

Frontend

 * React (Vite)

 * React Router DOM

 * Axios

* Tailwind CSS (for design)

* Google Web Speech API (for mic input)

* Netlify (for hosting)


Backend

* Node.js + Express.js

* MongoDB Atlas (Mongoose ODM)

* Google Gemini API (AI chat)

* Google Calendar API (Appointments)

* google-tts-api (Voice replies)

* Render (for deployment)

---

### ⚙️ Setup Instructions (Local)

1️⃣ Clone the repository

```
git clone https://github.com/aniket8000/ai_recp_dental.git
cd ai_recp_dental
```

2️⃣ Backend Setup

```
cd backend
npm install
```

Create a .env file inside /backend:

```
MONGODB_URI=your_mongo_uri
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_SERVICE_ACCOUNT_PATH=./config/service-account.json
PORT=3000
SESSION_SECRET=super_secret_key
FRONTEND_URL=http://localhost:5173
```


Then run:
```
npm run dev
```

3️⃣ Frontend Setup
```
cd ../voice-ai-frontend
npm install
```


Create a .env file inside /voice-ai-frontend:
```
VITE_API_URL=http://localhost:3000
```


Run:
```
npm run dev
```

```
Open: 👉 http://localhost:5173
```
---

### 🧠 Workflow Summary

Frontend sends chat or booking requests to backend.

Backend routes message → Gemini API → detects intent.

If intent = “book_appointment”: creates Google Calendar event.

Response text → converted to speech via Google TTS.

Frontend displays + optionally plays AI’s reply.

---

### 🧰 Tools & Libraries

Google Gemini API → AI chat & intent parsing

Google Calendar API → event booking

google-tts-api → converts text → voice URL

MongoDB Atlas → stores appointment data

Netlify + Render → production deployment