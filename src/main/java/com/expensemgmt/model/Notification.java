package com.expensemgmt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.PrePersist;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "read_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date readAt;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "expires_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;

    public enum NotificationType {
        EXPENSE_SUBMITTED("Expense Submitted"),
        EXPENSE_APPROVED("Expense Approved"),
        EXPENSE_REJECTED("Expense Rejected"),
        EXPENSE_REIMBURSED("Expense Reimbursed"),
        BUDGET_ALERT("Budget Alert"),
        POLICY_VIOLATION("Policy Violation"),
        APPROVAL_REMINDER("Approval Reminder"),
        SYSTEM_MAINTENANCE("System Maintenance");

        private final String displayName;

        NotificationType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Constructors
    public Notification() {}

    public Notification(String id, String userId, NotificationType type, String message) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.createdAt = new Date();
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        if (isRead == null) {
            isRead = false;
        }
    }

    // Business methods
    public boolean isExpired() {
        return expiresAt != null && new Date().after(expiresAt);
    }

    public boolean isUnread() {
        return !isRead;
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = new Date();
    }

    public String getDisplayMessage() {
        return message;
    }

    public String getTimeAgo() {
        if (createdAt == null) return "Unknown";

        long diffInMillies = new Date().getTime() - createdAt.getTime();
        long diffInMinutes = diffInMillies / (1000 * 60);
        long diffInHours = diffInMillies / (1000 * 60 * 60);
        long diffInDays = diffInMillies / (1000 * 60 * 60 * 24);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return diffInMinutes + " minutes ago";
        if (diffInHours < 24) return diffInHours + " hours ago";
        return diffInDays + " days ago";
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public Date getReadAt() {
        return readAt;
    }

    public void setReadAt(Date readAt) {
        this.readAt = readAt;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Override toString
    @Override
    public String toString() {
        return "Notification{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", type=" + type +
                ", message='" + message + '\'' +
                ", isRead=" + isRead +
                ", createdAt=" + createdAt +
                '}';
    }
}
