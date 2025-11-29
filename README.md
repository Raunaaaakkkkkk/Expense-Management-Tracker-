# Expense Management Tracker

A Java web application for corporate expense management using Servlets, JSP, MySQL, JDBC, and Apache Tomcat, designed to streamline expense tracking, approval workflows, and financial reporting.

## 🚀 Features

### Core Functionality
- **Expense Submission & Tracking**: Submit expenses with receipts, categories, and detailed information
- **Multi-level Approval Workflow**: Configurable approval processes with different user roles
- **Team Management**: Add and manage team members with role-based permissions
- **Dashboard**: Interactive charts and analytics for expense insights
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
- **Modern UI**: Responsive design with HTML5, CSS3, and JavaScript
- **File Uploads**: Receipt and document attachment support
- **Data Visualization**: Interactive charts using JavaScript libraries

## 🛠️ Tech Stack

### Backend
- **Language**: Java 11+
- **Web Framework**: Java Servlets and JSP
- **Database**: MySQL 8.0+
- **Database Access**: JDBC
- **Build Tool**: Maven
- **Application Server**: Apache Tomcat 9+

### Frontend
- **Markup**: HTML5
- **Styling**: CSS3
- **Scripting**: JavaScript (Vanilla/ES6+)
- **Templates**: JSP (JavaServer Pages)

### Database & Persistence
- **Primary Database**: MySQL
- **Data Access**: DAO (Data Access Object) pattern with JDBC
- **Connection Management**: Database connection pooling

### Development Tools
- **Version Control**: Git
- **Build Tool**: Maven
- **IDE**: Any Java IDE (Eclipse, IntelliJ IDEA, VS Code)
- **Database Tool**: MySQL Workbench or similar

## 📋 Prerequisites

### System Requirements
- Java 11+ (JDK)
- Maven 3.6+
- MySQL 8.0+
- Apache Tomcat 9+
- Git

### Installation
1. **Java JDK**: Download and install from [Oracle](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or [OpenJDK](https://openjdk.java.net/)
2. **Maven**: Download from [maven.apache.org](https://maven.apache.org/download.cgi)
3. **MySQL**: Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
4. **Apache Tomcat**: Download from [tomcat.apache.org](https://tomcat.apache.org/download-90.cgi)

## 🚀 Getting Started

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/Raunaaaakkkkkk/Expense-Management-Tracker-.git
   cd expense-mgmt
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE expense_mgmt;
   -- Run the schema creation script from src/main/resources/schema.sql
   ```

3. **Configure database connection**
   - Update database credentials in `src/main/java/com/expensemgmt/util/DatabaseConnection.java`
   - Or configure via Tomcat context.xml

4. **Build the application**
   ```bash
   ./build.sh
   ```
   Or manually:
   ```bash
   mvn clean compile
   mvn package
   ```

5. **Deploy to Tomcat**
   - Copy `target/expense-management-tracker.war` to Tomcat's `webapps/` directory
   - Or use Tomcat Manager to deploy the WAR file

6. **Start Tomcat**
   ```bash
   # Windows
   startup.bat
   
   # Linux/Mac
   startup.sh
   ```

7. **Access the application**
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
├── src/main/java/com/expensemgmt/     # Java source code
│   ├── dao/                          # Data Access Objects
│   ├── model/                        # Data models/entities
│   ├── servlet/                      # Servlet controllers
│   ├── service/                      # Business logic services
│   └── util/                         # Utility classes
├── src/main/webapp/                  # Web application resources
│   ├── WEB-INF/                      # Protected resources
│   │   ├── jsp/                      # JSP pages
│   │   └── web.xml                   # Web application configuration
│   ├── css/                          # Stylesheets
│   ├── js/                           # JavaScript files
│   └── index.jsp                     # Main entry point
├── src/main/resources/               # Application resources
│   ├── schema.sql                    # Database schema
│   └── migrate_data.sql              # Data migration scripts
├── target/                           # Build output (generated)
├── pom.xml                           # Maven configuration
├── build.sh                          # Build script
└── README.md
```

## 🔧 Available Scripts

### Maven Commands
- `mvn clean` - Clean build artifacts
- `mvn compile` - Compile Java sources
- `mvn test` - Run unit tests
- `mvn package` - Build WAR file
- `mvn clean package` - Full clean build

### Build Script
- `./build.sh` - Automated build and deployment preparation

### Tomcat Commands
- `startup.sh/startup.bat` - Start Tomcat server
- `shutdown.sh/shutdown.bat` - Stop Tomcat server

## 🌐 Deployment

### Tomcat Deployment
1. **Build the WAR file**
   ```bash
   mvn clean package
   ```

2. **Deploy to Tomcat**
   - Copy `target/expense-management-tracker.war` to `TOMCAT_HOME/webapps/`
   - Or use Tomcat Web Application Manager

3. **Configure Database**
   - Set up MySQL database
   - Update connection settings in `DatabaseConnection.java` or `context.xml`

4. **Start Tomcat**
   ```bash
   TOMCAT_HOME/bin/startup.sh
   ```

5. **Access Application**
   - URL: `http://localhost:8080/expense-management-tracker`

### Production Considerations
- Configure connection pooling in Tomcat
- Set up proper logging
- Configure SSL/TLS
- Set up backup strategies for database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📊 Database Schema

The application uses MySQL with the following main tables:
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

This project is currently migrating from a Next.js-based implementation to a Java Servlet/JSP web application:

- ✅ **Completed**: Maven project structure setup
- ✅ **Completed**: Database schema conversion to MySQL
- ✅ **Completed**: JDBC utilities and DAO classes
- ✅ **Completed**: Basic authentication servlet
- 🔄 **In Progress**: Expense CRUD operations servlet
- 🔄 **In Progress**: Dashboard and reporting JSP pages
- 🔄 **In Progress**: Approval workflow implementation
- 📋 **Planned**: Comprehensive testing and production deployment

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support or questions, please create an issue in the GitHub repository.
