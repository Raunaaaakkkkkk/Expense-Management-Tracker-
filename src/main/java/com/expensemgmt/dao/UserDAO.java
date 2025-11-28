package com.expensemgmt.dao;

import com.expensemgmt.model.User;
import com.expensemgmt.util.DatabaseConnection;

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for User operations
 */
public class UserDAO {
    private static final Logger logger = Logger.getLogger(UserDAO.class.getName());

    /**
     * Find user by email
     */
    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM user WHERE email = ?";
        User user = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    user = mapResultSetToUser(rs);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error finding user by email: " + email, e);
            throw e;
        }

        return user;
    }

    /**
     * Find user by ID
     */
    public User findById(String id) throws SQLException {
        String sql = "SELECT * FROM user WHERE id = ?";
        User user = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    user = mapResultSetToUser(rs);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error finding user by ID: " + id, e);
            throw e;
        }

        return user;
    }

    /**
     * Create a new user
     */
    public void create(User user) throws SQLException {
        String sql = "INSERT INTO user (id, email, name, password_hash, role, organization_id, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getId());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getName());
            stmt.setString(4, user.getPasswordHash());
            stmt.setString(5, user.getRole().toString());
            stmt.setString(6, user.getOrganizationId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }

            logger.info("User created successfully: " + user.getEmail());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error creating user: " + user.getEmail(), e);
            throw e;
        }
    }

    /**
     * Update user
     */
    public void update(User user) throws SQLException {
        String sql = "UPDATE user SET name = ?, role = ?, can_view_team_page = ?, " +
                    "can_view_approval_page = ?, can_manage_team_expenses = ?, " +
                    "can_view_reports = ?, can_manage_policies = ?, can_manage_stores = ?, " +
                    "updated_at = NOW() WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getName());
            stmt.setString(2, user.getRole().toString());
            stmt.setBoolean(3, user.isCanViewTeamPage());
            stmt.setBoolean(4, user.isCanViewApprovalPage());
            stmt.setBoolean(5, user.isCanManageTeamExpenses());
            stmt.setBoolean(6, user.isCanViewReports());
            stmt.setBoolean(7, user.isCanManagePolicies());
            stmt.setBoolean(8, user.isCanManageStores());
            stmt.setString(9, user.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Updating user failed, no rows affected.");
            }

            logger.info("User updated successfully: " + user.getEmail());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating user: " + user.getEmail(), e);
            throw e;
        }
    }

    /**
     * Helper method to map ResultSet to User object
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getString("id"));
        user.setEmail(rs.getString("email"));
        user.setName(rs.getString("name"));
        user.setImage(rs.getString("image"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setRole(User.Role.valueOf(rs.getString("role")));
        user.setCanViewTeamPage(rs.getBoolean("can_view_team_page"));
        user.setCanViewApprovalPage(rs.getBoolean("can_view_approval_page"));
        user.setCanManageTeamExpenses(rs.getBoolean("can_manage_team_expenses"));
        user.setCanViewReports(rs.getBoolean("can_view_reports"));
        user.setCanManagePolicies(rs.getBoolean("can_manage_policies"));
        user.setCanManageStores(rs.getBoolean("can_manage_stores"));
        user.setOrganizationId(rs.getString("organization_id"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));

        return user;
    }
}
