# Flex It Out

Flex It Out is a real-time fitness tracking application that leverages pose detection to count exercises and store workout data in MongoDB. The app features real-time analysis, a leaderboard, and profile management to enhance the user experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)
- [License](#license)

## Features

- Pose detection-based exercise tracking
- Personalized workout data storage
- Real-time analytics and progress tracking
- Interactive leaderboard for competition
- Profile management system
- Responsive UI for mobile and desktop

## Tech Stack

### Frontend:
- Next.js
- Tailwind CSS
- Axios
- Agora SDK (for real-time video/Audio challenges)
- react-circular-progressbar
- Socket.io

### Backend:
- Node.js
- Express.js
- MongoDB
- JWT authentication
- Socket.io

## Installation

### Clone the repository:
```bash
git clone https://github.com/Lalitmax/flex-it-out.git
cd flex-it-out
```

### Install dependencies:

#### For the frontend:
```bash
cd client
npm i
npm run dev
```

If you encounter errors related to Node.js or React versions, try:
```bash
npm install react@18.3.1 react-dom@18.3.1
npm install --legacy-peer-deps
npm cache clean --force
npm install
```

#### For the backend:
```bash
cd server
npm i
npm run dev
```

### Set up environment variables:

#### Backend:
Inside the `config` folder, create a `.env` file with:
```env
MONGOURI=your_mongodb_url
PORT=your_port
JWT_SECRET=your_jwt_secret
```

#### Frontend:
Inside the `client` folder, create a `.env` file in the root with:
```env
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
```

## Usage

1. **Login / Sign Up** to access personalized fitness tracking.
2. **Perform exercises** while the app detects your movements and counts reps.
3. **View analytics** for insights into your workout performance.
4. **Check the leaderboard** to see rankings based on workout data.
5. **Manage your profile** for personalized experience.

## Contribution

Contributions are welcome! Here’s how you can help:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a pull request.

Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

