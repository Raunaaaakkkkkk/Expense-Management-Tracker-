package com.expensemgmt.model;

import java.sql.Timestamp;

/**
 * Category model class
 */
public class Category {
    private String id;
    private String name;
    private String organizationId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public Category() {}

    public Category(String id, String name, String organizationId) {
        this.id = id;
        this.name = name;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", organizationId='" + organizationId + '\'' +
                '}';
    }
}
