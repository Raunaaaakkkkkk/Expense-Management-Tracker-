# Expense Management Tracker

A comprehensive expense management system built with Next.js, designed to streamline corporate expense tracking, approval workflows, and financial reporting.

## 🚀 Features

### Core Functionality
- **Expense Submission & Tracking**: Submit expenses with receipts, categories, and detailed information
- **Multi-level Approval Workflow**: Configurable approval processes with different user roles
- **Team Management**: Add and manage team members with role-based permissions
- **Real-time Dashboard**: Interactive charts and analytics for expense insights
- **Policy Management**: Define and enforce spending policies and limits
- **Reports & Analytics**: Generate comprehensive expense reports and export data

### User Roles & Permissions
- **Admin**: Full system access, user management, policy configuration
- **Manager**: Team oversight, approval authority, reporting access
- **Accountant**: Financial reporting, reimbursement processing
- **Employee**: Expense submission and personal expense tracking

### Technical Features
- **Secure Authentication**: NextAuth.js integration with role-based access control
- **Database**: SQLite with Prisma ORM for reliable data management
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: Live notifications and status updates
- **File Uploads**: Receipt and document attachment support
- **Data Visualization**: Interactive charts using Recharts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raunaaaakkkkkk/Expense-Management-Tracker-.git
   cd expense-mgmt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push database schema
   npm run db:push

   # Seed with demo data
   npm run db:seed
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Demo Accounts

After seeding, you can log in with these demo accounts:

- **Admin**: `admin@demo.local` / `demo123`
- **Manager**: `manager@demo.local` / `demo123`
- **Accountant**: `accountant@demo.local` / `demo123`
- **Employee**: `employee@demo.local` / `demo123`

## 📁 Project Structure

```
expense-mgmt/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.cjs              # Database seeding script
│   └── migrations/           # Database migrations
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── expenses/         # Expense management
│   │   ├── teams/            # Team management
│   │   └── ...
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and configurations
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with demo data

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support or questions, please create an issue in the GitHub repository.

## 🔄 Updates

Keep your dependencies updated:
```bash
npm update
npm run prisma:generate  # If Prisma schema changed
```
