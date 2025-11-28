package com.expensemgmt.dao;

import com.expensemgmt.model.Expense;
import com.expensemgmt.util.DatabaseConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for Expense operations
 */
public class ExpenseDAO {
    private static final Logger logger = Logger.getLogger(ExpenseDAO.class.getName());

    /**
     * Get total expense count for organization
     */
    public int getTotalExpenseCount(String organizationId, String userId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM expense WHERE organization_id = ?";
        if (userId != null) {
            sql += " AND user_id = ?";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        }
    }

    /**
     * Get expense count by status
     */
    public int getExpenseCountByStatus(String organizationId, String status, String userId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM expense WHERE organization_id = ? AND status = ?";
        if (userId != null) {
            sql += " AND user_id = ?";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            stmt.setString(2, status);
            if (userId != null) {
                stmt.setString(3, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        }
    }

    /**
     * Get total expense amount
     */
    public BigDecimal getTotalExpenseAmount(String organizationId, String userId) throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM expense WHERE organization_id = ?";
        if (userId != null) {
            sql += " AND user_id = ?";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
            }
        }
    }

    /**
     * Get current month expense amount
     */
    public BigDecimal getCurrentMonthExpenseAmount(String organizationId, String userId) throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM expense WHERE organization_id = ? " +
                    "AND YEAR(date) = YEAR(CURRENT_DATE) AND MONTH(date) = MONTH(CURRENT_DATE)";
        if (userId != null) {
            sql += " AND user_id = ?";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
            }
        }
    }

    /**
     * Get last month expense amount
     */
    public BigDecimal getLastMonthExpenseAmount(String organizationId, String userId) throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM expense WHERE organization_id = ? " +
                    "AND YEAR(date) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) " +
                    "AND MONTH(date) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))";
        if (userId != null) {
            sql += " AND user_id = ?";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
            }
        }
    }

    /**
     * Get recent expenses
     */
    public List<Expense> getRecentExpenses(String organizationId, String userId, int limit) throws SQLException {
        String sql = "SELECT e.*, u.name as user_name, c.name as category_name " +
                    "FROM expense e " +
                    "LEFT JOIN user u ON e.user_id = u.id " +
                    "LEFT JOIN category c ON e.category_id = c.id " +
                    "WHERE e.organization_id = ?";
        if (userId != null) {
            sql += " AND e.user_id = ?";
        }
        sql += " ORDER BY e.created_at DESC LIMIT ?";

        List<Expense> expenses = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
                stmt.setInt(3, limit);
            } else {
                stmt.setInt(2, limit);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Expense expense = new Expense();
                    expense.setId(rs.getString("id"));
                    expense.setTitle(rs.getString("title"));
                    expense.setAmount(rs.getBigDecimal("amount"));
                    expense.setCurrency(rs.getString("currency"));
                    expense.setDate(rs.getDate("date"));
                    expense.setNotes(rs.getString("notes"));
                    expense.setStatus(Expense.Status.valueOf(rs.getString("status")));
                    expense.setReceiptUrl(rs.getString("receipt_url"));
                    expense.setUserId(rs.getString("user_id"));
                    expense.setOrganizationId(rs.getString("organization_id"));
                    expense.setStoreId(rs.getString("store_id"));
                    expense.setCategoryId(rs.getString("category_id"));
                    expense.setCreatedAt(rs.getTimestamp("created_at"));
                    expense.setUpdatedAt(rs.getTimestamp("updated_at"));

                    // Set additional fields for display
                    expense.setUserName(rs.getString("user_name"));
                    expense.setCategoryName(rs.getString("category_name"));

                    expenses.add(expense);
                }
            }
        }

        return expenses;
    }

    /**
     * Get expenses grouped by category
     */
    public Map<String, BigDecimal> getExpensesByCategory(String organizationId, String userId) throws SQLException {
        String sql = "SELECT COALESCE(c.name, 'Uncategorized') as category, SUM(e.amount) as total " +
                    "FROM expense e " +
                    "LEFT JOIN category c ON e.category_id = c.id " +
                    "WHERE e.organization_id = ?";
        if (userId != null) {
            sql += " AND e.user_id = ?";
        }
        sql += " GROUP BY c.name ORDER BY total DESC";

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            if (userId != null) {
                stmt.setString(2, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    result.put(rs.getString("category"), rs.getBigDecimal("total"));
                }
            }
        }

        return result;
    }

    /**
     * Get monthly expenses for the last N months
     */
    public Map<String, BigDecimal> getMonthlyExpenses(String organizationId, String userId, int months) throws SQLException {
        String sql = "SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as total " +
                    "FROM expense " +
                    "WHERE organization_id = ? AND date >= DATE_SUB(CURRENT_DATE, INTERVAL ? MONTH)";
        if (userId != null) {
            sql += " AND user_id = ?";
        }
        sql += " GROUP BY DATE_FORMAT(date, '%Y-%m') ORDER BY month";

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);
            stmt.setInt(2, months);
            if (userId != null) {
                stmt.setString(3, userId);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    result.put(rs.getString("month"), rs.getBigDecimal("total"));
                }
            }
        }

        return result;
    }
}
