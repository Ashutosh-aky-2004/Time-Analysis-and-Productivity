# TimeFlow - Productivity & Time Analysis Platform

TimeFlow is a comprehensive productivity and time analysis application designed to help users track their tasks, manage projects, and gain insights into their productivity habits. It features a modern, responsive UI and a robust backend for secure data management.

## 🚀 Key Features

### 🔐 Authentication & Security

- **Multi-method Login**: Support for traditional Email/Password and **Google Authentication** (integrated via Firebase).
- **Secure Sign-up**: User registration with automatic handling for Google users.
- **Forgot Password Workflow**: Complete 3-step recovery process (Email -> OTP -> New Password).
  - **OTP Security**: OTPs are generated on the backend and sent via EmailJS.
  - **Expiration**: OTPs are valid for 5 minutes with real-time countdowns.
- **JWT Authorization**: Secure, token-based session management.

### 📊 Dashboard & Analytics

- **Personal Dashboard**: Visual overview of personal productivity with charts and stats.
- **Focus Trends**: Dynamic tracking of daily focus scores and activity.
- **Project Analysis**: Detailed insights into project progress and time allocation.

### 📁 Project & Task Management

- **Project Organization**: Create, edit, and delete projects with metadata (priority, status, dates).
- **Task Tracking**: Manage tasks and subtasks within projects.
- **Role-Based Access**: Project Manager roles with specific permissions (e.g., editing project details).

### 👤 User Profile

- **Profile Management**: Update personal information and avatar (integrated with Cloudinary).
- **Activity History**: View recent logs and actions.

## 🛠️ Technology Stack

### Frontend (Client)

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & React Context.
- **Routing**: [React Router DOM](https://reactrouter.com/).
- **Data Visualization**: [Recharts](https://recharts.org/) and Chart.js.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with Yup validation.
- **Utilities**: EmailJS (email sending), Axios (API requests), Moment.js/Date-fns (date handling).

### Backend (Server)

- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/).
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM.
- **Authentication**: Firebase Admin (for Google Auth verification) & JWT.
- **File Storage**: Cloudinary for image uploads.
- **Security**: Bcrypt for password hashing, CORS protection.

## 📂 Project Structure

```bash
/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (useGoogleLogin, useLogin, etc.)
│   │   ├── pages/          # Application pages (Login, Dashboard, etc.)
│   │   ├── context/        # React Context providers
│   │   ├── config/         # Firebase and app config
│   │   └── ...
│   ├── .env                # Client environment variables
│   └── box.json            # Dependencies
│
└── server/                 # Backend Node.js Application
    ├── controllers/        # Request handlers (Auth, Projects, Tasks)
    ├── routes/             # API Route definitions
    ├── modal/              # Mongoose Data Models
    ├── middleware/         # Auth and error middleware
    ├── config/             # DB and service configuration
    └── .env                # Server environment variables
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)
- Firebase Project (for Google Auth)
- EmailJS Account (for Forgot Password)
- Cloudinary Account (for Image Uploads)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Time_Analysis_Website
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAILJS_SERVICE_ID=your_emailjs_service_id  # Optional (if backend logic used)
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Start the server:

```bash
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Start the client:

```bash
npm run dev
```

## 🧪 Key Workflows

### Forgot Password Flow

1.  User enters email on `/forgot-password`.
2.  Server generates a 6-digit OTP, hashes it, and saves it to the DB with a 5-minute expiry.
3.  Server returns the OTP (in response) to the client.
4.  Client uses EmailJS to send the OTP to the user's email.
5.  User enters OTP; server verifies it against the hashed version.
6.  User resets password.

### Google Login

1.  User clicks "Continue with Google".
2.  Firebase Popup handles authentication.
3.  Client sends Firebase token/user info to Backend
4.  Backend verifies/creates user and issues a session JWT.
5.  User is logged in.

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
