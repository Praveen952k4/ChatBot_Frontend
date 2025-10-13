# 💬 Chatbot Frontend

A modern, responsive, and ChatGPT-style frontend built with **React.js**, **Tailwind CSS / MUI**, and **Redux Toolkit**, designed to connect with a Node.js + PostgreSQL backend.

This app enables authenticated users to chat with an integrated LLM, manage organizations, track credits, and receive real-time notifications — all through a clean, intuitive interface.

---

## 🚀 Features Overview

### 🔐 Authentication & Onboarding
- **Username + Password** authentication (JWT-based).
- **Google Sign-In (OAuth 2.0)** support.
- On first registration:
  - Automatically creates a **default organization**.
  - Assigns the user as **Admin**.
- Onboarding flow redirects to the **main chat interface**.
- Persistent user session and onboarding progress stored in database.

---

### 💬 Chat Interface (ChatGPT-style)
- Modern **two-column layout**:
  - **Left Sidebar**: Displays chat sessions and navigation.
  - **Main Chat Area**: Shows messages between user and assistant.
  - **Top Bar (Right)**: Displays user **credits** and a **notification bell**.
- **Persistent chat history** per session.
- **Credit deduction system**:
  - Deducts credits per token/message usage.
  - Restricts new messages when credits are insufficient.
- Fully responsive and mobile-friendly.

---

### 🏢 Organization Management
- Create and rename organizations.
- Switch between organizations.
- View and manage organization members.
- Invite members by email (database record only, no actual email sending).
- Display all organizations user belongs to, with one active at a time.

---

### 🔔 Real-Time Notifications
- **Socket.IO**-based WebSocket connection for real-time updates.
- Global and targeted notifications.
- Expandable **notification panel**.
- Persistent notification history.
- Graceful reconnection and session handling.

---

## 🧠 Architecture

### 🏗️ Recommended Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | React.js (Vite) |
| **UI Styling** | Tailwind CSS / Material-UI (MUI) |
| **State Management** | Redux Toolkit |
| **Routing** | React Router |
| **Real-time Communication** | Socket.IO Client |
| **API Calls** | Axios / Fetch API |
| **Deployment** | Vercel |

---


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/praveen952k4/chatbot-frontend.git
cd chatbot-frontend
```

## 🎨 UI & Design Guidelines

Match the 🎨 provided UI design reference
 as closely as possible.

Keep consistent spacing, typography, and color palette.

Use modular, reusable, and accessible components.

Fully responsive across mobile, tablet, and desktop.


## 🧠 Key Concepts Implemented

JWT-based authentication handling in frontend.

Protected routes with automatic redirection.

Persistent Redux store using redux-persist.

Dynamic credit and notification state updates.

Clean API layer for backend interaction.

Socket.IO hooks for real-time updates.

## 💡 Future Enhancements

✅ Add message streaming (like ChatGPT typing effect).

✅ Theme switcher (Dark/Light mode).

✅ Organization analytics dashboard.

✅ Enhanced notification grouping and filters.
