# Resume Builder Application

## Overview

This is a modern, AI-powered resume builder application that allows users to create, edit, and customize professional resumes. The application features a React frontend with a Node.js/Express backend, PostgreSQL database for data persistence, and integrates with OpenAI for intelligent content suggestions and optimization. Users can choose from multiple templates, get AI-powered improvements, and export their resumes to PDF format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **State Management**: TanStack Query for server state management and caching, React hooks for local component state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling and type-safe validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Session-based authentication with connect-pg-simple for PostgreSQL session storage
- **AI Integration**: OpenAI GPT-4o for resume content improvement, ATS optimization, and professional summary generation
- **PDF Generation**: jsPDF for client-side PDF export functionality

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting for scalable, managed database infrastructure
- **Schema Design**: Two main entities - Users and Resumes with proper foreign key relationships
- **Session Storage**: PostgreSQL-based session storage for user authentication state
- **File Storage**: JSON fields for flexible resume section data (experience, education, skills, etc.)

### External Dependencies
- **Database Hosting**: Neon Database (PostgreSQL-compatible serverless database)
- **AI Services**: OpenAI API for content enhancement and ATS analysis
- **UI Components**: Radix UI primitives via shadcn/ui for accessible, customizable components
- **Fonts**: Google Fonts integration for typography (Inter, DM Sans, Fira Code, etc.)
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Design Decisions
- **Monorepo Structure**: Client, server, and shared code in a single repository for easier development and deployment
- **Type Safety**: End-to-end TypeScript with shared schemas between frontend and backend
- **Component-Driven UI**: Modular component architecture with reusable UI primitives
- **Real-time Features**: Auto-save functionality for seamless user experience
- **Template System**: Flexible template engine supporting multiple resume layouts (modern, classic, creative, minimal)
- **AI Enhancement**: Integrated AI suggestions for content improvement and ATS optimization
- **Responsive Design**: Mobile-first approach with responsive layouts for all screen sizes