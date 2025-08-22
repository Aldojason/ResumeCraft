# ResumeCraft 🚀

A modern, AI-powered resume builder that helps you create professional resumes with intelligent guidance and ATS optimization.

## 🌐 Live Demo

**[Try ResumeCraft Live](https://resumecraft-gmoz.onrender.com)**

## ✨ Features

- **🤖 AI-Powered Assistance** - Get intelligent suggestions for resume improvements using Hugging Face AI models
- **📄 Multiple Templates** - Choose from professional resume templates optimized for different industries
- **⚡ Real-time Preview** - See changes instantly as you edit your resume
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🎨 Dark/Light Mode** - Toggle between themes for comfortable editing
- **📊 ATS Optimization** - Built-in Applicant Tracking System optimization for better job application success
- **💾 Auto-save** - Your progress is automatically saved as you work
- **📤 PDF Export** - Download your resume as a professional PDF
- **🔒 Secure** - Your data is protected with proper authentication and validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **jsPDF** for PDF generation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **Hugging Face AI** for intelligent assistance
- **WebSocket** for real-time features
- **Passport.js** for authentication

### Deployment
- **Docker** containerization
- **Render.com** hosting
- **Neon** PostgreSQL database

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- Hugging Face API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resumecraft.git
   cd ResumeCraft
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL=your_postgres_connection_string
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📖 Usage

### Creating Your First Resume

1. **Start with a template** - Choose from our professional templates
2. **Fill in your information** - Add your personal details, experience, education, and skills
3. **Get AI assistance** - Use the AI chat to get suggestions for improvements
4. **Preview and refine** - See your resume in real-time and make adjustments
5. **Export to PDF** - Download your professional resume

### AI Assistant Features

- **Content suggestions** - Get help with writing compelling descriptions
- **ATS optimization** - Ensure your resume passes through applicant tracking systems
- **Keyword analysis** - Identify important keywords for your target role
- **Formatting tips** - Receive guidance on professional formatting

## 🐳 Docker Deployment

### Build and run with Docker
```bash
# Build the image
docker build -f ResumeCraft/Dockerfile -t resumecraft:latest .

# Run the container
docker run --rm -p 5000:5000 \
  -e PORT=5000 \
  -e DATABASE_URL=your_database_url \
  -e HUGGINGFACE_API_KEY=your_api_key \
  resumecraft:latest
```

## 🌐 Production Deployment

### Render.com (Recommended)

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Root Directory:** `ResumeCraft`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`
   - **Runtime:** Node 20

4. **Add environment variables:**
   - `DATABASE_URL` (required)
   - `HUGGINGFACE_API_KEY` (optional)
   - `OPENAI_API_KEY` (optional)

## 📁 Project Structure

```
ResumeCraft/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── services/          # Business logic and AI services
│   ├── routes/            # API routes
│   └── db.ts             # Database configuration
├── shared/                # Shared types and schemas
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


