<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Expense Management</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-card {
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
        }
        .error-header {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .error-body {
            padding: 2rem;
            background: white;
        }
        .btn-home {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .btn-home:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="error-card">
                    <div class="error-header">
                        <i class="fas fa-exclamation-triangle fa-4x mb-3"></i>
                        <h2>Oops!</h2>
                        <p>Something went wrong</p>
                    </div>
                    <div class="error-body">
                        <div class="text-center">
                            <c:choose>
                                <c:when test="${not empty error}">
                                    <h5 class="text-danger mb-3">
                                        <i class="fas fa-times-circle"></i> Error Details
                                    </h5>
                                    <p class="text-muted">${error}</p>
                                </c:when>
                                <c:when test="${pageContext.errorData.statusCode == 404}">
                                    <h5 class="text-warning mb-3">
                                        <i class="fas fa-search"></i> Page Not Found
                                    </h5>
                                    <p class="text-muted">The page you're looking for doesn't exist.</p>
                                </c:when>
                                <c:when test="${pageContext.errorData.statusCode == 403}">
                                    <h5 class="text-warning mb-3">
                                        <i class="fas fa-lock"></i> Access Denied
                                    </h5>
                                    <p class="text-muted">You don't have permission to access this page.</p>
                                </c:when>
                                <c:otherwise>
                                    <h5 class="text-danger mb-3">
                                        <i class="fas fa-bug"></i> Unexpected Error
                                    </h5>
                                    <p class="text-muted">
                                        An unexpected error occurred. Please try again later or contact support.
                                    </p>
                                </c:otherwise>
                            </c:choose>

                            <div class="mt-4">
                                <a href="${pageContext.request.contextPath}/dashboard" class="btn btn-primary btn-home me-2">
                                    <i class="fas fa-home"></i> Go to Dashboard
                                </a>
                                <a href="${pageContext.request.contextPath}/login" class="btn btn-outline-secondary">
                                    <i class="fas fa-sign-in-alt"></i> Login
                                </a>
                            </div>

                            <c:if test="${pageContext.errorData.statusCode >= 500}">
                                <div class="mt-4">
                                    <details class="text-start">
                                        <summary class="text-muted small">Technical Details (for developers)</summary>
                                        <div class="mt-2 p-2 bg-light rounded small">
                                            <strong>Status Code:</strong> ${pageContext.errorData.statusCode}<br>
                                            <strong>Request URI:</strong> ${pageContext.errorData.requestURI}<br>
                                            <strong>Servlet Name:</strong> ${pageContext.errorData.servletName}<br>
                                            <c:if test="${not empty pageContext.exception}">
                                                <strong>Exception:</strong> ${pageContext.exception}<br>
                                                <strong>Message:</strong> ${pageContext.exception.message}
                                            </c:if>
                                        </div>
                                    </details>
                                </div>
                            </c:if>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
