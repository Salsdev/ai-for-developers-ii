# QuickVote – Modern Polling Application

QuickVote is a modern, open-source polling app built with Next.js, Shadcn UI, and Tailwind CSS. It enables users to easily create, manage, and participate in polls with a fast, responsive, and intuitive interface. The project is designed for scalability, maintainability, and seamless integration with backend services.

---

## 🚀 Features

- **User Authentication**: Secure login, registration, password reset, and forgot password flows powered by Supabase Auth
- **Poll Creation**: Easily create polls with multiple options and rich descriptions
- **Live Voting**: Vote in real time and see instant, auto-updating results
- **User Dashboard**: Personalized dashboard with poll stats and quick actions
- **Password Reset**: Users can request a password reset link and set a new password via email
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop with Tailwind CSS
- **Modern UI**: Clean, accessible interface powered by Shadcn UI components.

---

## 🧑‍💻 User Guide

### 1. Getting Started

#### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn

#### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Salsdev/ai-for-developers-ii.git
   cd quick-vote
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

### 2. Using QuickVote

#### Creating an Account / Logging In

- Click the **Login** or **Register** button on the homepage.
- Enter your credentials. Authentication is now powered by Supabase Auth.

#### Forgot Password / Reset Password

- On the login page, click **Forgot Password** to request a reset link.
- Check your email for a reset link and follow the instructions to set a new password.

#### Creating a Poll

- After logging in, go to your **Dashboard**.
- Click **Create Poll**.
- Enter a poll title, description, and add as many options as you like.
- Click **Publish** to make your poll live.

#### Voting in a Poll

- Browse available polls on the homepage or dashboard.
- Click on a poll to view details.
- Select your preferred option and click **Vote**.
- See live, auto-updating results instantly.

#### Managing Your Polls

- Access your dashboard to view all polls you’ve created.
- See stats like total votes and participation.
- Edit or delete your polls as needed.

### 3. Customization & Integration

- The app is ready for integration with real authentication and backend services (Supabase is used by default).
- UI is fully customizable via Tailwind CSS and Shadcn UI components.

---

## 🗂 Project Structure

<details>
<summary>Click to expand</summary>