package com.expensemgmt;

import com.expensemgmt.model.*;
import com.expensemgmt.dao.*;
import com.expensemgmt.util.DatabaseConnection;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

/**
 * Simple console-based Expense Management System
 * Demonstrates core functionality with JDBC and MySQL
 */
public class Main {
    private static Scanner scanner = new Scanner(System.in);
    private static UserDAO userDAO;
    private static ExpenseDAO expenseDAO;
    private static CategoryDAO categoryDAO;

    public static void main(String[] args) {
        System.out.println("=== Expense Management Tracker ===");
        System.out.println("Java Console Application with MySQL");

        try {
            // Initialize DAOs
            userDAO = new UserDAO();
            expenseDAO = new ExpenseDAO();
            categoryDAO = new CategoryDAO();

            // Test database connection
            Connection conn = DatabaseConnection.getConnection();
            if (conn != null) {
                System.out.println("✓ Database connection successful!");
                conn.close();
            }

            // Demo functionality
            runDemo();

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void runDemo() throws SQLException {
        System.out.println("\n--- Demo: Core Functionality ---\n");

        // 1. Create sample user
        System.out.println("1. Creating sample user...");
        User user = new User();
        user.setId("demo-user-1");
        user.setEmail("demo@example.com");
        user.setName("Demo User");
        user.setPasswordHash("hashedpassword");
        user.setRole(User.Role.EMPLOYEE);
        user.setOrganizationId("demo-org");

        // Note: In real app, this would be handled by UserDAO.create()
        System.out.println("✓ Sample user created: " + user.getName());

        // 2. Create sample category
        System.out.println("\n2. Creating sample category...");
        Category category = new Category();
        category.setId("demo-category-1");
        category.setName("Travel");
        category.setOrganizationId("demo-org");

        // Note: In real app, this would be handled by CategoryDAO.create()
        System.out.println("✓ Sample category created: " + category.getName());

        // 3. Create sample expense
        System.out.println("\n3. Creating sample expense...");
        Expense expense = new Expense();
        expense.setId("demo-expense-1");
        expense.setTitle("Flight to Conference");
        expense.setAmount(new BigDecimal("500.00"));
        expense.setCurrency("USD");
        expense.setDate(new java.util.Date());
        expense.setNotes("Business travel");
        expense.setStatus(Expense.Status.PENDING);
        expense.setUserId(user.getId());
        expense.setOrganizationId("demo-org");
        expense.setCategoryId(category.getId());

        // Note: In real app, this would be handled by ExpenseDAO.create()
        System.out.println("✓ Sample expense created: " + expense.getTitle() + " - $" + expense.getAmount());

        // 4. Demonstrate data retrieval (mock data)
        System.out.println("\n4. Retrieving expense data...");
        System.out.println("Expense ID: " + expense.getId());
        System.out.println("Title: " + expense.getTitle());
        System.out.println("Amount: $" + expense.getAmount());
        System.out.println("Status: " + expense.getStatus());
        System.out.println("Category: " + category.getName());
        System.out.println("User: " + user.getName());

        // 5. Show expense statistics
        System.out.println("\n5. Expense Statistics (Demo Data)...");
        System.out.println("Total Expenses: 1");
        System.out.println("Pending Expenses: 1");
        System.out.println("Approved Expenses: 0");
        System.out.println("Total Amount: $" + expense.getAmount());

        System.out.println("\n--- Demo Complete ---");
        System.out.println("This demonstrates the core Java classes and data models.");
        System.out.println("To run the full web application, you would need:");
        System.out.println("- Apache Tomcat server");
        System.out.println("- MySQL database setup");
        System.out.println("- Complete DAO implementations");
        System.out.println("- Web servlets and JSP pages");
    }
}
