# ConvoX 💬

**Real-time conversations. Simple, seamless, connected.**

ConvoX is a full-stack messaging application built with the MERN stack and Socket.IO. It brings private conversations, instant messaging, image sharing, and live online presence together in a clean, responsive interface.

<p align="center">
  <a href="https://convox-hvn5.onrender.com"><strong>🚀 Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/Vishnu-222/ConvoX"><strong>📂 Source Code</strong></a>
</p>

## ✨ Features

- **Real-time messaging** — Send and receive messages instantly with Socket.IO.
- **Secure authentication** — JWT-based authentication with HTTP-only cookies.
- **Online presence** — See when contacts come online or go offline.
- **Image sharing** — Share images through Cloudinary.
- **Persistent conversations** — Messages are stored in MongoDB.
- **Profile management** — Update profile information and profile pictures.
- **Welcome emails** — Email integration using Resend.
- **Responsive UI** — Chat comfortably across desktop and mobile devices.
- **Sound preferences** — Configure notification and typing sounds.

## 🛠️ Built With

| Frontend | Backend & Services |
|---|---|
| React | Node.js |
| Vite | Express.js |
| Tailwind CSS & DaisyUI | MongoDB Atlas & Mongoose |
| Zustand | Socket.IO |
| Axios | JWT & bcrypt |
| | Cloudinary & Resend |

## 🖥️ Preview

Try ConvoX live:

**[convox-hvn5.onrender.com →](https://convox-hvn5.onrender.com)**

<img width="1885" height="919" alt="image" src="https://github.com/user-attachments/assets/843bcf6d-5dd0-4f2c-a5c4-80f724658c2b" />


## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- MongoDB connection string
- Cloudinary credentials
- Resend API key (for email functionality)

### 1. Clone the repository

```bash
git clone https://github.com/Vishnu-222/ConvoX.git
cd ConvoX
```

### 2. Install dependencies

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_sender_email
EMAIL_FROM_NAME=ConvoX
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Replace the placeholder values with your own credentials. Never commit real secrets to GitHub.

### 4. Start the application

Run the backend:

```bash
npm --prefix backend run start
```

In a separate terminal, start the frontend:

```bash
npm --prefix frontend run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🏗️ Architecture

```text
React + Vite
     │
     ├── REST API ────── Express.js
     │                       │
     └── Socket.IO ──────────┤
                             │
                         MongoDB
                             │
                    Cloudinary / Resend
```

The frontend uses REST APIs for application operations and Socket.IO for real-time communication. Express serves the production frontend and backend from a single Render web service.

## ☁️ Deployment

ConvoX is deployed on **Render**, with MongoDB Atlas for database storage.

🔗 **[Visit the live application](https://convox-hvn5.onrender.com)**

## 🔮 What's Next?

- Permanent account deletion with associated conversation data cleanup.
- AI-powered conversation summaries.
- AI-assisted conversation insights.

## 👨‍💻 Author

**Vishnu Singh**

[GitHub](https://github.com/Vishnu-222) · [LinkedIn](https://www.linkedin.com/in/vishnu-singh-435116237/)

---

*Built to learn, build, and bring real-time communication to life.*
