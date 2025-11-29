package com.expensemgmt.model;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class Organization {

    private String id;
    private String name;
    private String description;
    private String industry;
    private String website;
    private String email;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String taxId;
    private String registrationNumber;
    private String fiscalYearStart;
    private String currency = "USD";
    private String timezone = "UTC";
    private Boolean isActive = true;
    private String subscriptionPlan;
    private Integer maxUsers;
    private Integer maxExpensesPerMonth;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
    private List<User> users = new ArrayList<>();
    private List<Expense> expenses = new ArrayList<>();
    private List<Policy> policies = new ArrayList<>();
    private List<Budget> budgets = new ArrayList<>();

    // Constructors
    public Organization() {}

    public Organization(String id, String name) {
        this.id = id;
        this.name = name;
        this.isActive = true;
        this.currency = "USD";
        this.timezone = "UTC";
    }

    // Business methods
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (addressLine1 != null) address.append(addressLine1);
        if (addressLine2 != null) {
            if (address.length() > 0) address.append(", ");
            address.append(addressLine2);
        }
        if (city != null) {
            if (address.length() > 0) address.append(", ");
            address.append(city);
        }
        if (state != null) {
            if (address.length() > 0) address.append(", ");
            address.append(state);
        }
        if (postalCode != null) {
            if (address.length() > 0) address.append(" ");
            address.append(postalCode);
        }
        if (country != null) {
            if (address.length() > 0) address.append(", ");
            address.append(country);
        }
        return address.toString();
    }

    public boolean isSubscriptionActive() {
        return subscriptionPlan != null && !subscriptionPlan.trim().isEmpty();
    }

    public boolean hasReachedUserLimit() {
        return maxUsers != null && users != null && users.size() >= maxUsers;
    }

    public boolean hasReachedExpenseLimit() {
        return maxExpensesPerMonth != null && expenses != null &&
               expenses.stream().filter(e -> e.getSubmissionDate() != null &&
                   e.getSubmissionDate().getMonth() == new Date().getMonth()).count() >= maxExpensesPerMonth;
    }

    public int getActiveUserCount() {
        return users != null ? (int) users.stream().filter(User::getIsActive).count() : 0;
    }

    public int getCurrentMonthExpenseCount() {
        if (expenses == null) return 0;
        Date now = new Date();
        return (int) expenses.stream()
                .filter(e -> e.getSubmissionDate() != null &&
                        e.getSubmissionDate().getYear() == now.getYear() &&
                        e.getSubmissionDate().getMonth() == now.getMonth())
                .count();
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

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getFiscalYearStart() {
        return fiscalYearStart;
    }

    public void setFiscalYearStart(String fiscalYearStart) {
        this.fiscalYearStart = fiscalYearStart;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(String subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public Integer getMaxUsers() {
        return maxUsers;
    }

    public void setMaxUsers(Integer maxUsers) {
        this.maxUsers = maxUsers;
    }

    public Integer getMaxExpensesPerMonth() {
        return maxExpensesPerMonth;
    }

    public void setMaxExpensesPerMonth(Integer maxExpensesPerMonth) {
        this.maxExpensesPerMonth = maxExpensesPerMonth;
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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public List<Policy> getPolicies() {
        return policies;
    }

    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }

    public List<Budget> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Organization that = (Organization) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Override toString
    @Override
    public String toString() {
        return "Organization{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                '}';
    }
}
