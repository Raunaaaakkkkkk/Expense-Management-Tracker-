package com.expensemgmt.model;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class User {

    private String id;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private String password;
    private Role role;
    private String organizationId;
    private String department;
    private String jobTitle;
    private String phoneNumber;
    private Boolean isActive = true;
    private Boolean isEmailVerified = false;
    private Date lastLoginDate;
    private String passwordResetToken;
    private Date passwordResetExpires;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
    private User manager;
    private List<User> subordinates = new ArrayList<>();
    private List<Expense> expenses = new ArrayList<>();

    public enum Role {
        EMPLOYEE("Employee"),
        MANAGER("Manager"),
        ACCOUNTANT("Accountant"),
        ADMIN("Administrator");

        private final String displayName;

        Role(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Constructors
    public User() {}

    public User(String id, String email, String name, Role role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.isActive = true;
        this.isEmailVerified = false;
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
        if (isActive == null) {
            isActive = true;
        }
        if (isEmailVerified == null) {
            isEmailVerified = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    // Business methods
    public boolean isAdmin() {
        return Role.ADMIN.equals(this.role);
    }

    public boolean isManager() {
        return Role.MANAGER.equals(this.role);
    }

    public boolean isAccountant() {
        return Role.ACCOUNTANT.equals(this.role);
    }

    public boolean isEmployee() {
        return Role.EMPLOYEE.equals(this.role);
    }

    public boolean canApproveExpenses() {
        return isAdmin() || isManager() || isAccountant();
    }

    public boolean canManageUsers() {
        return isAdmin() || isManager();
    }

    public boolean canViewAllExpenses() {
        return isAdmin() || isManager() || isAccountant();
    }

    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return name;
    }

    public void setFullName(String fullName) {
        this.name = fullName;
        // Optionally parse first and last name
        if (fullName != null && fullName.contains(" ")) {
            String[] parts = fullName.split(" ", 2);
            this.firstName = parts[0];
            this.lastName = parts[1];
        }
    }

    public boolean isPasswordResetTokenValid() {
        return passwordResetToken != null &&
               passwordResetExpires != null &&
               passwordResetExpires.after(new Date());
    }

    public void generatePasswordResetToken() {
        // In a real application, generate a secure random token
        this.passwordResetToken = java.util.UUID.randomUUID().toString();
        this.passwordResetExpires = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000); // 24 hours
    }

    public void clearPasswordResetToken() {
        this.passwordResetToken = null;
        this.passwordResetExpires = null;
    }

    public void updateLastLogin() {
        this.lastLoginDate = new Date();
    }

    // Getters and setters

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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    public Date getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(Date lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public String getPasswordResetToken() {
        return passwordResetToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public Date getPasswordResetExpires() {
        return passwordResetExpires;
    }

    public void setPasswordResetExpires(Date passwordResetExpires) {
        this.passwordResetExpires = passwordResetExpires;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public List<User> getSubordinates() {
        return subordinates;
    }

    public void setSubordinates(List<User> subordinates) {
        this.subordinates = subordinates;
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Override toString
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                '}';
    }
}
