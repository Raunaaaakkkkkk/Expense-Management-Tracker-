package com.expensemgmt.dao;

import com.expensemgmt.model.Category;
import com.expensemgmt.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for Category operations
 */
public class CategoryDAO {
    private static final Logger logger = Logger.getLogger(CategoryDAO.class.getName());

    /**
     * Get all categories for an organization
     */
    public List<Category> getByOrganizationId(String organizationId) throws SQLException {
        String sql = "SELECT * FROM category WHERE organization_id = ? ORDER BY name";
        List<Category> categories = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    categories.add(mapResultSetToCategory(rs));
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error getting categories for organization: " + organizationId, e);
            throw e;
        }

        return categories;
    }

    /**
     * Find category by ID
     */
    public Category findById(String id) throws SQLException {
        String sql = "SELECT * FROM category WHERE id = ?";
        Category category = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    category = mapResultSetToCategory(rs);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error finding category by ID: " + id, e);
            throw e;
        }

        return category;
    }

    /**
     * Create a new category
     */
    public void create(Category category) throws SQLException {
        String sql = "INSERT INTO category (id, name, organization_id, created_at, updated_at) " +
                    "VALUES (?, ?, ?, NOW(), NOW())";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, category.getId());
            stmt.setString(2, category.getName());
            stmt.setString(3, category.getOrganizationId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Creating category failed, no rows affected.");
            }

            logger.info("Category created successfully: " + category.getName());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error creating category: " + category.getName(), e);
            throw e;
        }
    }

    /**
     * Update category
     */
    public void update(Category category) throws SQLException {
        String sql = "UPDATE category SET name = ?, updated_at = NOW() WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, category.getName());
            stmt.setString(2, category.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Updating category failed, no rows affected.");
            }

            logger.info("Category updated successfully: " + category.getName());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating category: " + category.getName(), e);
            throw e;
        }
    }

    /**
     * Delete category
     */
    public void delete(String id) throws SQLException {
        String sql = "DELETE FROM category WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Deleting category failed, no rows affected.");
            }

            logger.info("Category deleted successfully: " + id);

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error deleting category: " + id, e);
            throw e;
        }
    }

    /**
     * Helper method to map ResultSet to Category object
     */
    private Category mapResultSetToCategory(ResultSet rs) throws SQLException {
        Category category = new Category();
        category.setId(rs.getString("id"));
        category.setName(rs.getString("name"));
        category.setOrganizationId(rs.getString("organization_id"));
        category.setCreatedAt(rs.getTimestamp("created_at"));
        category.setUpdatedAt(rs.getTimestamp("updated_at"));

        return category;
    }
}
