# SportX India CPD Platform

A comprehensive web platform empowering sports and allied health professionals to manage their career development through innovative technological solutions.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sportx-cpd-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with professional data
   cd scripts && npx tsx seed-database.ts
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📋 Features

- **Professional Development Tracking**: Comprehensive CPD management system
- **Event Management**: Workshop registration and attendance tracking
- **Course Library**: Professional development courses with certifications
- **Community Forums**: Discussion boards and mentorship opportunities
- **Real-time Features**: Live notifications and user status updates
- **Mobile Responsive**: Optimized for all device sizes

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Authentication**: Session-based authentication
- **Deployment**: Replit with auto-deployment

## 📁 Project Structure

```
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared types and schemas
├── scripts/             # Database seeding and utility scripts
├── .github/workflows/   # CI/CD configuration
└── docs/                # Documentation
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run db:push` - Push schema changes to database
- `npm run lint` - Lint code (if configured)

### Code Style

- Use TypeScript for type safety
- Follow React best practices with hooks
- Use Tailwind CSS for styling
- Implement responsive design principles

## 📊 Database Seeding

The platform includes comprehensive seeding options:

1. **SQL Scripts**: Direct database population (`scripts/seed.sql`)
2. **TypeScript Seeding**: Programmatic data generation (`scripts/seed-database.ts`)
3. **Quick Seeding**: Fast Supabase population (`scripts/quick-seed.ts`)

See `SEEDING_GUIDE.md` for detailed instructions.

## 🚀 Deployment

### Replit Deployment
1. Connect your repository to Replit
2. Configure environment variables
3. Deploy with one click

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Run database migrations

## 🔐 Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=your_database_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Optional
NODE_ENV=production
PORT=5000
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

See `CONTRIBUTING.md` for detailed guidelines.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.