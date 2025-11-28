package com.expensemgmt.dao;

import com.expensemgmt.model.Store;
import com.expensemgmt.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for Store operations
 */
public class StoreDAO {
    private static final Logger logger = Logger.getLogger(StoreDAO.class.getName());

    /**
     * Get all stores for an organization
     */
    public List<Store> getByOrganizationId(String organizationId) throws SQLException {
        String sql = "SELECT * FROM store WHERE organization_id = ? ORDER BY name";
        List<Store> stores = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, organizationId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    stores.add(mapResultSetToStore(rs));
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error getting stores for organization: " + organizationId, e);
            throw e;
        }

        return stores;
    }

    /**
     * Find store by ID
     */
    public Store findById(String id) throws SQLException {
        String sql = "SELECT * FROM store WHERE id = ?";
        Store store = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    store = mapResultSetToStore(rs);
                }
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error finding store by ID: " + id, e);
            throw e;
        }

        return store;
    }

    /**
     * Create a new store
     */
    public void create(Store store) throws SQLException {
        String sql = "INSERT INTO store (id, name, address, type, number_of_employees, organization_id, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, store.getId());
            stmt.setString(2, store.getName());
            stmt.setString(3, store.getAddress());
            stmt.setString(4, store.getType());
            if (store.getNumberOfEmployees() != null) {
                stmt.setInt(5, store.getNumberOfEmployees());
            } else {
                stmt.setNull(5, Types.INTEGER);
            }
            stmt.setString(6, store.getOrganizationId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Creating store failed, no rows affected.");
            }

            logger.info("Store created successfully: " + store.getName());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error creating store: " + store.getName(), e);
            throw e;
        }
    }

    /**
     * Update store
     */
    public void update(Store store) throws SQLException {
        String sql = "UPDATE store SET name = ?, address = ?, type = ?, number_of_employees = ?, updated_at = NOW() WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, store.getName());
            stmt.setString(2, store.getAddress());
            stmt.setString(3, store.getType());
            if (store.getNumberOfEmployees() != null) {
                stmt.setInt(4, store.getNumberOfEmployees());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.setString(5, store.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Updating store failed, no rows affected.");
            }

            logger.info("Store updated successfully: " + store.getName());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error updating store: " + store.getName(), e);
            throw e;
        }
    }

    /**
     * Delete store
     */
    public void delete(String id) throws SQLException {
        String sql = "DELETE FROM store WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Deleting store failed, no rows affected.");
            }

            logger.info("Store deleted successfully: " + id);

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error deleting store: " + id, e);
            throw e;
        }
    }

    /**
     * Helper method to map ResultSet to Store object
     */
    private Store mapResultSetToStore(ResultSet rs) throws SQLException {
        Store store = new Store();
        store.setId(rs.getString("id"));
        store.setName(rs.getString("name"));
        store.setAddress(rs.getString("address"));
        store.setType(rs.getString("type"));
        store.setNumberOfEmployees(rs.getInt("number_of_employees"));
        if (rs.wasNull()) {
            store.setNumberOfEmployees(null);
        }
        store.setOrganizationId(rs.getString("organization_id"));
        store.setCreatedAt(rs.getTimestamp("created_at"));
        store.setUpdatedAt(rs.getTimestamp("updated_at"));

        return store;
    }
}
