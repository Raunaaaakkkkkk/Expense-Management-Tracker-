package com.expensemgmt.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.Currency;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

public class Expense {

    private String id;
    private String title;
    private String description;
    private BigDecimal amount;
    private String currency;
    private Date expenseDate;
    private Date submissionDate;
    private Date approvalDate;
    private Date rejectionDate;
    private Status status = Status.DRAFT;
    private String userId;
    private String organizationId;
    private String categoryId;
    private String storeId;
    private String approvedBy;
    private String rejectionReason;
    private String receiptUrl;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal taxRate = BigDecimal.ZERO;
    private boolean isReimbursable = true;
    private Date createdAt;
    private Date updatedAt;

    // Constructors
    public Expense() {}

    public Expense(String id, String title, BigDecimal amount, String currency, Date expenseDate, String userId, String organizationId) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.currency = currency;
        this.expenseDate = expenseDate;
        this.submissionDate = new Date();
        this.userId = userId;
        this.organizationId = organizationId;
        this.status = Status.DRAFT;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Date getExpenseDate() { return expenseDate; }
    public void setExpenseDate(Date expenseDate) { this.expenseDate = expenseDate; }

    public Date getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(Date submissionDate) { this.submissionDate = submissionDate; }

    public Date getApprovalDate() { return approvalDate; }
    public void setApprovalDate(Date approvalDate) { this.approvalDate = approvalDate; }

    public Date getRejectionDate() { return rejectionDate; }
    public void setRejectionDate(Date rejectionDate) { this.rejectionDate = rejectionDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }

    public boolean isReimbursable() { return isReimbursable; }
    public void setReimbursable(boolean reimbursable) { isReimbursable = reimbursable; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    // Utility methods
    public BigDecimal getTotalAmount() {
        return amount.add(taxAmount != null ? taxAmount : BigDecimal.ZERO);
    }

    public boolean isApproved() {
        return status == Status.APPROVED;
    }

    public boolean isRejected() {
        return status == Status.REJECTED;
    }

    public boolean isPending() {
        return status == Status.PENDING;
    }

    // Status enum
    public enum Status {
        DRAFT("Draft"),
        PENDING("Pending Approval"),
        APPROVED("Approved"),
        REJECTED("Rejected"),
        REIMBURSED("Reimbursed");

        private final String displayName;

        Status(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Expense expense = (Expense) o;
        return Objects.equals(id, expense.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Expense{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", status=" + status +
                ", expenseDate=" + expenseDate +
                '}';
    }
}
