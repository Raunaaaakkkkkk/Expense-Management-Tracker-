package com.expensemgmt.model;

import java.sql.Timestamp;

/**
 * User model class
 */
public class User {
    public enum Role {
        ADMIN, MANAGER, EMPLOYEE, ACCOUNTANT
    }

    private String id;
    private String email;
    private String name;
    private String image;
    private String passwordHash;
    private Role role;
    private boolean canViewTeamPage;
    private boolean canViewApprovalPage;
    private boolean canManageTeamExpenses;
    private boolean canViewReports;
    private boolean canManagePolicies;
    private boolean canManageStores;
    private String organizationId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public User() {}

    public User(String id, String email, String name, Role role, String organizationId) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isCanViewTeamPage() {
        return canViewTeamPage;
    }

    public void setCanViewTeamPage(boolean canViewTeamPage) {
        this.canViewTeamPage = canViewTeamPage;
    }

    public boolean isCanViewApprovalPage() {
        return canViewApprovalPage;
    }

    public void setCanViewApprovalPage(boolean canViewApprovalPage) {
        this.canViewApprovalPage = canViewApprovalPage;
    }

    public boolean isCanManageTeamExpenses() {
        return canManageTeamExpenses;
    }

    public void setCanManageTeamExpenses(boolean canManageTeamExpenses) {
        this.canManageTeamExpenses = canManageTeamExpenses;
    }

    public boolean isCanViewReports() {
        return canViewReports;
    }

    public void setCanViewReports(boolean canViewReports) {
        this.canViewReports = canViewReports;
    }

    public boolean isCanManagePolicies() {
        return canManagePolicies;
    }

    public void setCanManagePolicies(boolean canManagePolicies) {
        this.canManagePolicies = canManagePolicies;
    }

    public boolean isCanManageStores() {
        return canManageStores;
    }

    public void setCanManageStores(boolean canManageStores) {
        this.canManageStores = canManageStores;
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
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                ", organizationId='" + organizationId + '\'' +
                '}';
    }
}
