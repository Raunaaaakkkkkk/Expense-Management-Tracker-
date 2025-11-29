package com.expensemgmt.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class Policy {

    private String id;
    private String name;
    private String description;
    private String organizationId;
    private String categoryId;
    private BigDecimal maxAmount;
    private Boolean requiresReceipt = true;
    private Boolean requiresApproval = true;
    private BigDecimal approvalThreshold;
    private Boolean isActive = true;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
    private Organization organization;
    private Category category;
    private List<Expense> expenses = new ArrayList<>();

    // Constructors
    public Policy() {}

    public Policy(String id, String name, String organizationId) {
        this.id = id;
        this.name = name;
        this.organizationId = organizationId;
        this.requiresReceipt = true;
        this.requiresApproval = true;
        this.isActive = true;
    }

    // Business methods
    public boolean isExpenseCompliant(Expense expense) {
        if (!isActive) return true; // Inactive policies don't restrict

        if (maxAmount != null && expense.getAmount() != null &&
            expense.getAmount().compareTo(maxAmount) > 0) {
            return false;
        }

        if (requiresReceipt && (expense.getReceiptUrl() == null || expense.getReceiptUrl().trim().isEmpty())) {
            return false;
        }

        if (requiresApproval && approvalThreshold != null && expense.getAmount() != null &&
            expense.getAmount().compareTo(approvalThreshold) >= 0) {
            return false; // Requires approval but expense is over threshold
        }

        return true;
    }

    public boolean requiresApprovalForAmount(BigDecimal amount) {
        return requiresApproval && approvalThreshold != null &&
               amount != null && amount.compareTo(approvalThreshold) >= 0;
    }

    public boolean requiresReceiptForAmount(BigDecimal amount) {
        return requiresReceipt && (maxAmount == null || amount == null || amount.compareTo(maxAmount) >= 0);
    }

    // Getters and setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getMaxAmount() {
        return maxAmount;
    }

    public void setMaxAmount(BigDecimal maxAmount) {
        this.maxAmount = maxAmount;
    }

    public Boolean getRequiresReceipt() {
        return requiresReceipt;
    }

    public void setRequiresReceipt(Boolean requiresReceipt) {
        this.requiresReceipt = requiresReceipt;
    }

    public Boolean getRequiresApproval() {
        return requiresApproval;
    }

    public void setRequiresApproval(Boolean requiresApproval) {
        this.requiresApproval = requiresApproval;
    }

    public BigDecimal getApprovalThreshold() {
        return approvalThreshold;
    }

    public void setApprovalThreshold(BigDecimal approvalThreshold) {
        this.approvalThreshold = approvalThreshold;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
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
        Policy policy = (Policy) o;
        return Objects.equals(id, policy.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Override toString
    @Override
    public String toString() {
        return "Policy{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", maxAmount=" + maxAmount +
                ", isActive=" + isActive +
                '}';
    }
}
