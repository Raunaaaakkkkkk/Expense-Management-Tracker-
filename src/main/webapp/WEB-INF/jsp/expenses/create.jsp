<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Expense - Expense Management</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .form-card {
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .form-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .form-body {
            padding: 2rem;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="${pageContext.request.contextPath}/dashboard">
                <i class="fas fa-calculator"></i> Expense Management
            </a>
            <div class="navbar-nav">
                <a class="nav-link" href="${pageContext.request.contextPath}/dashboard">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a class="nav-link active" href="${pageContext.request.contextPath}/expenses">
                    <i class="fas fa-list"></i> Expenses
                </a>
            </div>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text me-3">
                    Welcome, ${user.name}
                </span>
                <a class="btn btn-outline-light btn-sm" href="${pageContext.request.contextPath}/logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="form-card">
                    <div class="form-header">
                        <i class="fas fa-plus-circle fa-3x mb-3"></i>
                        <h3>Create New Expense</h3>
                        <p>Submit a new expense for approval</p>
                    </div>
                    <div class="form-body">
                        <c:if test="${not empty error}">
                            <div class="alert alert-danger" role="alert">
                                <i class="fas fa-exclamation-triangle"></i>
                                ${error}
                            </div>
                        </c:if>

                        <form action="${pageContext.request.contextPath}/expenses" method="post" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="title" class="form-label">
                                        <i class="fas fa-heading"></i> Title *
                                    </label>
                                    <input type="text" class="form-control" id="title" name="title"
                                           placeholder="Enter expense title" required
                                           value="${param.title}">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="amount" class="form-label">
                                        <i class="fas fa-rupee-sign"></i> Amount *
                                    </label>
                                    <input type="number" class="form-control" id="amount" name="amount"
                                           placeholder="0.00" step="0.01" min="0.01" required
                                           value="${param.amount}">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="currency" class="form-label">
                                        <i class="fas fa-coins"></i> Currency
                                    </label>
                                    <select class="form-select" id="currency" name="currency">
                                        <option value="INR" selected>INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="date" class="form-label">
                                        <i class="fas fa-calendar"></i> Date *
                                    </label>
                                    <input type="date" class="form-control" id="date" name="date" required
                                           value="${param.date != null ? param.date : ''}">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="categoryId" class="form-label">
                                        <i class="fas fa-tag"></i> Category
                                    </label>
                                    <select class="form-select" id="categoryId" name="categoryId">
                                        <option value="">Select Category</option>
                                        <c:forEach var="category" items="${categories}">
                                            <option value="${category.id}" ${param.categoryId == category.id ? 'selected' : ''}>
                                                ${category.name}
                                            </option>
                                        </c:forEach>
                                    </select>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="storeId" class="form-label">
                                        <i class="fas fa-store"></i> Store/Location
                                    </label>
                                    <select class="form-select" id="storeId" name="storeId">
                                        <option value="">Select Store</option>
                                        <c:forEach var="store" items="${stores}">
                                            <option value="${store.id}" ${param.storeId == store.id ? 'selected' : ''}>
                                                ${store.name}
                                            </option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="notes" class="form-label">
                                    <i class="fas fa-sticky-note"></i> Notes
                                </label>
                                <textarea class="form-control" id="notes" name="notes" rows="3"
                                          placeholder="Additional notes or description">${param.notes}</textarea>
                            </div>

                            <div class="mb-4">
                                <label for="receipt" class="form-label">
                                    <i class="fas fa-file-upload"></i> Receipt (Optional)
                                </label>
                                <input type="file" class="form-control" id="receipt" name="receipt"
                                       accept="image/*,.pdf">
                                <div class="form-text">
                                    Upload receipt image or PDF (max 5MB)
                                </div>
                            </div>

                            <div class="d-flex justify-content-between">
                                <a href="${pageContext.request.contextPath}/expenses" class="btn btn-outline-secondary">
                                    <i class="fas fa-arrow-left"></i> Back to Expenses
                                </a>
                                <button type="submit" class="btn btn-primary btn-submit">
                                    <i class="fas fa-save"></i> Submit Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Set default date to today
        document.addEventListener('DOMContentLoaded', function() {
            const dateInput = document.getElementById('date');
            if (!dateInput.value) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
        });

        // Form validation
        document.querySelector('form').addEventListener('submit', function(e) {
            const amount = document.getElementById('amount').value;
            if (parseFloat(amount) <= 0) {
                e.preventDefault();
                alert('Amount must be greater than 0');
                return false;
            }
        });
    </script>
</body>
</html>
