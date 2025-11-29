package com.expensemgmt.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class Budget {

    private String id;
    private String name;
    private String description;
    private String organizationId;
    private String categoryId;
    private String department;
    private BudgetPeriod period;
    private Date startDate;
    private Date endDate;
    private BigDecimal allocatedAmount;
    private BigDecimal spentAmount = BigDecimal.ZERO;
    private BigDecimal alertThreshold = new BigDecimal("0.80");
    private Boolean isActive = true;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
    private Organization organization;
    private Category category;
    private List<Expense> expenses = new ArrayList<>();

    public enum BudgetPeriod {
        MONTHLY("Monthly"),
        QUARTERLY("Quarterly"),
        ANNUALLY("Annually");

        private final String displayName;

        BudgetPeriod(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Constructors
    public Budget() {}

    public Budget(String id, String name, String organizationId, BudgetPeriod period,
                  Date startDate, Date endDate, BigDecimal allocatedAmount) {
        this.id = id;
        this.name = name;
        this.organizationId = organizationId;
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
        this.allocatedAmount = allocatedAmount;
        this.spentAmount = BigDecimal.ZERO;
        this.alertThreshold = new BigDecimal("0.80");
        this.isActive = true;
    }

    // Business methods
    public BigDecimal getRemainingAmount() {
        return allocatedAmount.subtract(spentAmount);
    }

    public BigDecimal getUtilizationPercentage() {
        if (allocatedAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return spentAmount.divide(allocatedAmount, 4, BigDecimal.ROUND_HALF_UP)
                         .multiply(new BigDecimal("100"));
    }

    public boolean isOverBudget() {
        return spentAmount.compareTo(allocatedAmount) > 0;
    }

    public boolean isNearLimit() {
        BigDecimal utilization = getUtilizationPercentage();
        return utilization.compareTo(alertThreshold.multiply(new BigDecimal("100"))) >= 0;
    }

    public void addExpense(Expense expense) {
        if (expense != null && expense.getAmount() != null) {
            this.spentAmount = this.spentAmount.add(expense.getAmount());
            this.expenses.add(expense);
        }
    }

    public void removeExpense(Expense expense) {
        if (expense != null && expense.getAmount() != null && this.expenses.contains(expense)) {
            this.spentAmount = this.spentAmount.subtract(expense.getAmount());
            this.expenses.remove(expense);
        }
    }

    public boolean isExpired() {
        return new Date().after(endDate);
    }

    public boolean isActive() {
        return isActive && !isExpired();
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public BudgetPeriod getPeriod() {
        return period;
    }

    public void setPeriod(BudgetPeriod period) {
        this.period = period;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getAlertThreshold() {
        return alertThreshold;
    }

    public void setAlertThreshold(BigDecimal alertThreshold) {
        this.alertThreshold = alertThreshold;
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
        Budget budget = (Budget) o;
        return Objects.equals(id, budget.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Override toString
    @Override
    public String toString() {
        return "Budget{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", allocatedAmount=" + allocatedAmount +
                ", spentAmount=" + spentAmount +
                ", isActive=" + isActive +
                '}';
    }
}
