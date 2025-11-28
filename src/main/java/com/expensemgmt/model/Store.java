package com.expensemgmt.model;

import java.sql.Timestamp;

/**
 * Store model class
 */
public class Store {
    public enum Type {
        OFFICE, RETAIL, WAREHOUSE, OTHER
    }

    private String id;
    private String name;
    private String address;
    private String type;
    private Integer numberOfEmployees;
    private String organizationId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public Store() {}

    public Store(String id, String name, String address, String type, String organizationId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.type = type;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getNumberOfEmployees() {
        return numberOfEmployees;
    }

    public void setNumberOfEmployees(Integer numberOfEmployees) {
        this.numberOfEmployees = numberOfEmployees;
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
        return "Store{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", type='" + type + '\'' +
                ", organizationId='" + organizationId + '\'' +
                '}';
    }
}
