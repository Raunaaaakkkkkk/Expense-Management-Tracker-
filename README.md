# Expense Management Tracker

A modern, full-stack expense management system combining a React-based frontend with a Spring Boot backend, designed to streamline corporate expense tracking, approval workflows, and financial reporting.

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
- **Secure Authentication**: NextAuth.js with session management and role-based access control
- **Database**: SQLite with Prisma ORM for reliable data management
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: Live notifications and status updates
- **File Uploads**: Receipt and document attachment support
- **Data Visualization**: Interactive charts using Recharts

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Database**: MySQL with Spring Data JPA
- **Build Tool**: Maven
- **Architecture**: RESTful API with layered architecture

### Database & ORM
- **Primary Database**: SQLite with Prisma (Development)
- **Production Database**: MySQL (Configured)
- **ORM**: Prisma Client for frontend, Spring Data JPA for backend

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint
- **Testing**: Jest (planned)

## 📋 Prerequisites

### Frontend Development
- Node.js 18+
- npm or yarn

### Backend Development
- Java 17+
- Maven 3.6+
- MySQL 8.0+ (for production)

## 🚀 Getting Started

### Quick Start (Frontend Only)
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
   npx prisma db push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Full Stack Development (Frontend + Backend)

1. **Set up the backend**
   ```bash
   # Configure MySQL database in src/main/resources/application.properties
   # Run the Spring Boot application
   mvn spring-boot:run
   ```

2. **Set up the frontend** (follow steps 1-5 above)

3. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

## 👤 Demo Accounts

After running the database seed:

- **Admin**: `admin@demo.local` / `demo123`
- **Manager**: `manager@demo.local` / `demo123`
- **Accountant**: `accountant@demo.local` / `demo123`
- **Employee**: `employee@demo.local` / `demo123`

## 📁 Project Structure

```
expense-mgmt/
├── prisma/                        # Database schema and migrations
│   ├── schema.prisma             # Prisma schema definition
│   ├── seed.cjs                  # Database seeding script
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   ├── dashboard/            # Dashboard page
│   │   ├── expenses/             # Expense management pages
│   │   ├── login/                # Authentication page
│   │   ├── reports/              # Reports page
│   │   ├── settings/             # Settings page
│   │   └── teams/                # Team management page
│   ├── components/               # Reusable React components
│   ├── lib/                      # Utility functions and configurations
│   ├── types/                    # TypeScript type definitions
│   └── main/java/com/expensemgmt/  # Spring Boot backend
│       ├── controller/           # REST controllers
│       ├── model/                # JPA entities
│       ├── repository/           # Data repositories
│       ├── service/              # Business logic services
│       └── ExpenseManagementApplication.java
├── package.json                  # Frontend dependencies
├── pom.xml                       # Backend Maven configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
└── README.md
```

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with demo data

### Backend Scripts
- `mvn clean compile` - Compile the project
- `mvn spring-boot:run` - Run Spring Boot application
- `mvn clean package` - Build JAR file
- `mvn clean test` - Run unit tests

## 🌐 Deployment

### Frontend Deployment
```bash
npm run build
npm run start
```

### Backend Deployment
```bash
mvn clean package
java -jar target/expense-management-0.0.1-SNAPSHOT.jar
```

### Docker Deployment (Planned)
- Docker Compose configuration for full-stack deployment
- Separate containers for frontend, backend, and database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📊 Database Schema

The application uses SQLite (development) / MySQL (production) with the following main tables:
- `organization` - Organization/company information
- `user` - User accounts and roles
- `expense` - Expense records with status tracking
- `category` - Expense categories
- `store` - Store/location information
- `policy` - Spending policies and limits
- `budget` - Budget allocations
- `notification` - System notifications
- `audit_log` - System audit trail

## 🔄 Migration Status

This project is currently migrating from a legacy Java Servlet/JSP implementation to a modern full-stack architecture:

- ✅ **Completed**: Next.js frontend with authentication and dashboard
- ✅ **Completed**: Spring Boot backend with JPA entities
- ✅ **Completed**: Prisma database schema and migrations
- 🔄 **In Progress**: API integration between frontend and backend
- 🔄 **In Progress**: Legacy servlet code migration
- 📋 **Planned**: Comprehensive testing and deployment pipeline

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support or questions, please create an issue in the GitHub repository.
