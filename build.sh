#!/bin/bash

# Expense Management Tracker - Build Script
# This script builds and deploys the Java web application

echo "🚀 Building Expense Management Tracker..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6+ first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 11+ first."
    exit 1
fi

echo "📦 Cleaning previous builds..."
mvn clean

echo "🔨 Compiling project..."
mvn compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed. Please fix the errors and try again."
    exit 1
fi

echo "🧪 Running tests..."
mvn test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues and try again."
    exit 1
fi

echo "📦 Packaging application..."
mvn package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Packaging failed. Please check the build configuration."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Generated files:"
echo "   - WAR file: target/expense-management-tracker.war"
echo ""
echo "🚀 To deploy:"
echo "   1. Copy target/expense-management-tracker.war to your Tomcat webapps directory"
echo "   2. Or use Tomcat Manager to deploy the WAR file"
echo "   3. Access the application at: http://localhost:8080/expense-management-tracker"
echo ""
echo "📋 Next steps:"
echo "   1. Set up MySQL database using src/main/resources/schema.sql"
echo "   2. Configure database connection in DatabaseConnection.java or context.xml"
echo "   3. Run data migration script if migrating from existing data"
echo "   4. Start Tomcat server"
echo ""
echo "🎉 Happy coding!"
