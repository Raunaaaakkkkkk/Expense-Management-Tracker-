<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Expense - Expense Management</title>
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
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .form-body {
            padding: 2rem;
        }
        .form-control:focus {
            border-color: #f39c12;
            box-shadow: 0 0 0 0.2rem rgba(243, 156, 18, 0.25);
        }
        .btn-submit {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
        }
        .current-receipt {
            max-width: 200px;
            max-height: 200px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
                        <i class="fas fa-edit fa-3x mb-3"></i>
                        <h3>Edit Expense</h3>
                        <p>Update expense information</p>
                    </div>
                    <div class="form-body">
                        <c:if test="${not empty error}">
                            <div class="alert alert-danger" role="alert">
                                <i class="fas fa-exclamation-triangle"></i>
                                ${error}
                            </div>
                        </c:if>

                        <form action="${pageContext.request.contextPath}/expenses/${expense.id}" method="post" enctype="multipart/form-data">
                            <input type="hidden" name="_method" value="PUT">

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="title" class="form-label">
                                        <i class="fas fa-heading"></i> Title *
                                    </label>
                                    <input type="text" class="form-control" id="title" name="title"
                                           placeholder="Enter expense title" required
                                           value="${expense.title}">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="amount" class="form-label">
                                        <i class="fas fa-rupee-sign"></i> Amount *
                                    </label>
                                    <input type="number" class="form-control" id="amount" name="amount"
                                           placeholder="0.00" step="0.01" min="0.01" required
                                           value="${expense.amount}">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="currency" class="form-label">
                                        <i class="fas fa-coins"></i> Currency
                                    </label>
                                    <select class="form-select" id="currency" name="currency">
                                        <option value="INR" ${expense.currency == 'INR' ? 'selected' : ''}>INR (₹)</option>
                                        <option value="USD" ${expense.currency == 'USD' ? 'selected' : ''}>USD ($)</option>
                                        <option value="EUR" ${expense.currency == 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                        <option value="GBP" ${expense.currency == 'GBP' ? 'selected' : ''}>GBP (£)</option>
                                    </select>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="date" class="form-label">
                                        <i class="fas fa-calendar"></i> Date *
                                    </label>
                                    <input type="date" class="form-control" id="date" name="date" required
                                           value="<fmt:formatDate value='${expense.date}' pattern='yyyy-MM-dd'/>">
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
                                            <option value="${category.id}" ${expense.categoryId == category.id ? 'selected' : ''}>
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
                                            <option value="${store.id}" ${expense.storeId == store.id ? 'selected' : ''}>
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
                                          placeholder="Additional notes or description">${expense.notes}</textarea>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">
                                    <i class="fas fa-file-upload"></i> Receipt
                                </label>
                                <c:if test="${not empty expense.receiptUrl}">
                                    <div class="mb-3">
                                        <label class="form-label">Current Receipt:</label>
                                        <div>
                                            <img src="${pageContext.request.contextPath}/uploads/${expense.receiptUrl}"
                                                 alt="Current Receipt" class="current-receipt">
                                        </div>
                                    </div>
                                </c:if>
                                <input type="file" class="form-control" id="receipt" name="receipt"
                                       accept="image/*,.pdf">
                                <div class="form-text">
                                    Upload new receipt image or PDF (max 5MB). Leave empty to keep current receipt.
                                </div>
                            </div>

                            <div class="d-flex justify-content-between">
                                <a href="${pageContext.request.contextPath}/expenses/${expense.id}" class="btn btn-outline-secondary">
                                    <i class="fas fa-arrow-left"></i> Back to Details
                                </a>
                                <button type="submit" class="btn btn-warning btn-submit">
                                    <i class="fas fa-save"></i> Update Expense
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
