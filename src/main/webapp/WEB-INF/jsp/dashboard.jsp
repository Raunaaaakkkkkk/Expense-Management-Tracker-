<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Management Dashboard</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .stat-card {
            border-radius: 10px;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-2px);
        }
        .gradient-pending {
            background: linear-gradient(135deg, #f39c12, #e67e22);
        }
        .gradient-approved {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
        }
        .gradient-rejected {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }
        .gradient-total {
            background: linear-gradient(135deg, #3498db, #2980b9);
        }
        .chart-container {
            position: relative;
            height: 300px;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="fas fa-calculator"></i> Expense Management
            </a>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text me-3">
                    Welcome, ${user.name} (${user.role})
                </span>
                <a class="btn btn-outline-light btn-sm" href="${pageContext.request.contextPath}/logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </h2>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card stat-card gradient-pending text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Pending</h5>
                                <h3>${pendingCount}</h3>
                            </div>
                            <i class="fas fa-clock fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stat-card gradient-approved text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Approved</h5>
                                <h3>${approvedCount}</h3>
                            </div>
                            <i class="fas fa-check-circle fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stat-card gradient-rejected text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Rejected</h5>
                                <h3>${rejectedCount}</h3>
                            </div>
                            <i class="fas fa-times-circle fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card stat-card gradient-total text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Total</h5>
                                <h3>${totalCount}</h3>
                            </div>
                            <i class="fas fa-list fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Financial Overview -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-line"></i> Financial Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <h6>Total Amount</h6>
                                <h4 class="text-primary">
                                    ₹<fmt:formatNumber value="${totalAmount}" pattern="#,##0.00"/>
                                </h4>
                            </div>
                            <div class="col-6">
                                <h6>This Month</h6>
                                <h4 class="text-success">
                                    ₹<fmt:formatNumber value="${thisMonthAmount}" pattern="#,##0.00"/>
                                </h4>
                                <small class="${isIncrease ? 'text-success' : 'text-danger'}">
                                    <i class="fas fa-arrow-${isIncrease ? 'up' : 'down'}"></i>
                                    ${monthChange}%
                                </small>
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: ${approvalRate}%">
                                    ${approvalRate}% Approved
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-list"></i> Recent Expenses</h5>
                    </div>
                    <div class="card-body">
                        <c:forEach var="expense" items="${recentExpenses}">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <strong>${expense.title}</strong>
                                    <br>
                                    <small class="text-muted">
                                        ${expense.userName} •
                                        <fmt:formatDate value="${expense.date}" pattern="dd MMM yyyy"/>
                                    </small>
                                </div>
                                <div class="text-end">
                                    <span class="badge bg-${expense.status == 'APPROVED' ? 'success' : expense.status == 'REJECTED' ? 'danger' : 'warning'}">
                                        ${expense.status}
                                    </span>
                                    <br>
                                    <strong>₹<fmt:formatNumber value="${expense.amount}" pattern="#,##0.00"/></strong>
                                </div>
                            </div>
                            <hr>
                        </c:forEach>
                        <c:if test="${empty recentExpenses}">
                            <p class="text-muted">No recent expenses found.</p>
                        </c:if>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-pie"></i> Expenses by Category</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar"></i> Monthly Trend</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="monthlyChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Chart.js Scripts -->
    <script>
        // Category Chart
        const categoryData = ${categoryDataJson};
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Monthly Chart
        const monthlyData = ${monthlyDataJson};
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Monthly Expenses',
                    data: Object.values(monthlyData),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
