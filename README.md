# Expense Management Tracker

A comprehensive expense management system built with Java Servlets, JSP, MySQL, JDBC, HTML5, CSS3, and JavaScript, designed to streamline corporate expense tracking, approval workflows, and financial reporting.

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
- **Secure Authentication**: Session-based authentication with role-based access control
- **Database**: MySQL with JDBC for reliable data management
- **Modern UI**: Responsive design with Bootstrap CSS and Font Awesome icons
- **Real-time Updates**: Live notifications and status updates
- **File Uploads**: Receipt and document attachment support
- **Data Visualization**: Interactive charts using Chart.js

## 🛠️ Tech Stack

- **Backend**: Java Servlets, JSP
- **Database**: MySQL with JDBC
- **Frontend**: HTML5, CSS3, JavaScript
- **Server**: Apache Tomcat
- **Build Tool**: Maven
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **Charts**: Chart.js

## 📋 Prerequisites

- Java 11+
- Apache Tomcat 9+
- MySQL 8.0+
- Maven 3.6+

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raunaaaakkkkkk/Expense-Management-Tracker-.git
   cd expense-mgmt
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE expense_mgmt;
   -- Run the SQL script from src/main/resources/schema.sql
   ```

3. **Configure database connection**
   Create a context.xml file in Tomcat's conf directory or update the DatabaseConnection.java file with your MySQL credentials.

4. **Build the project**
   ```bash
   mvn clean compile
   ```

5. **Package the application**
   ```bash
   mvn clean package
   ```

6. **Deploy to Tomcat**
   - Copy the generated WAR file from target/ to Tomcat's webapps directory
   - Or use Tomcat Manager to deploy the WAR file

7. **Start Tomcat**
   ```bash
   # Start Tomcat server
   ```

8. **Open your browser**
   Navigate to [http://localhost:8080/expense-management-tracker](http://localhost:8080/expense-management-tracker)

## 👤 Demo Accounts

After setting up the database with demo data:

- **Admin**: `admin@demo.local` / `demo123`
- **Manager**: `manager@demo.local` / `demo123`
- **Accountant**: `accountant@demo.local` / `demo123`
- **Employee**: `employee@demo.local` / `demo123`

## 📁 Project Structure

```
expense-mgmt/
├── src/
│   ├── main/
│   │   ├── java/com/expensemgmt/
│   │   │   ├── dao/              # Data Access Objects
│   │   │   ├── model/            # Model classes
│   │   │   ├── servlet/          # Servlet controllers
│   │   │   └── util/             # Utility classes
│   │   ├── resources/
│   │   │   └── schema.sql        # Database schema
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   ├── jsp/          # JSP pages
│   │       │   └── web.xml       # Web configuration
│   │       └── index.jsp         # Welcome page
│   └── test/                     # Unit tests
├── pom.xml                       # Maven configuration
└── README.md
```

## 🔧 Available Scripts

- `mvn clean compile` - Compile the project
- `mvn clean package` - Build WAR file
- `mvn clean test` - Run unit tests
- `mvn tomcat7:run` - Run with Tomcat plugin (requires configuration)

## 🌐 Deployment

### Apache Tomcat
1. Build the WAR file: `mvn clean package`
2. Copy target/expense-management-tracker.war to Tomcat's webapps directory
3. Start Tomcat server
4. Access at http://localhost:8080/expense-management-tracker

### Manual Deployment
1. Build the WAR file: `mvn clean package`
2. Use Tomcat Manager or deploy manually
3. Configure database connection in context.xml

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
mvn versions:display-dependency-updates
mvn versions:use-latest-versions
```

## 📊 Database Schema

The application uses MySQL with the following main tables:
- `organization` - Organization/company information
- `user` - User accounts and roles
- `expense` - Expense records
- `category` - Expense categories
- `store` - Store/location information
- `policy` - Spending policies
- `budget` - Budget allocations
- `audit_log` - System audit trail
