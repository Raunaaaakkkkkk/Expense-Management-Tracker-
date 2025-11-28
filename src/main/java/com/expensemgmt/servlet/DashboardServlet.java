package com.expensemgmt.servlet;

import com.expensemgmt.dao.ExpenseDAO;
import com.expensemgmt.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.google.gson.Gson;

/**
 * Dashboard servlet for displaying expense analytics and recent activity
 */
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private static final Logger logger = Logger.getLogger(DashboardServlet.class.getName());
    private ExpenseDAO expenseDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        expenseDAO = new ExpenseDAO();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        User user = (User) session.getAttribute("user");
        String organizationId = user.getOrganizationId();
        String userId = user.getRole() == User.Role.ADMIN ? null : user.getId(); // null for admin to see all

        try {
            // Get KPI data
            int totalCount = expenseDAO.getTotalExpenseCount(organizationId, userId);
            int pendingCount = expenseDAO.getExpenseCountByStatus(organizationId, "PENDING", userId);
            int approvedCount = expenseDAO.getExpenseCountByStatus(organizationId, "APPROVED", userId);
            int rejectedCount = expenseDAO.getExpenseCountByStatus(organizationId, "REJECTED", userId);
            BigDecimal totalAmount = expenseDAO.getTotalExpenseAmount(organizationId, userId);

            // Get monthly data
            BigDecimal thisMonthAmount = expenseDAO.getCurrentMonthExpenseAmount(organizationId, userId);
            BigDecimal lastMonthAmount = expenseDAO.getLastMonthExpenseAmount(organizationId, userId);

            // Calculate month-over-month change
            double monthChange = 0.0;
            boolean isIncrease = false;
            if (lastMonthAmount.compareTo(BigDecimal.ZERO) > 0) {
                monthChange = thisMonthAmount.subtract(lastMonthAmount)
                    .divide(lastMonthAmount, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
                isIncrease = thisMonthAmount.compareTo(lastMonthAmount) > 0;
            }

            // Calculate approval rate
            double approvalRate = totalCount > 0 ? (double) approvedCount / totalCount * 100 : 0.0;

            // Get chart data
            Map<String, BigDecimal> categoryData = expenseDAO.getExpensesByCategory(organizationId, userId);
            Map<String, BigDecimal> monthlyData = expenseDAO.getMonthlyExpenses(organizationId, userId, 6);

            // Get recent expenses
            var recentExpenses = expenseDAO.getRecentExpenses(organizationId, userId, 5);

            // Set attributes for JSP
            request.setAttribute("totalCount", totalCount);
            request.setAttribute("pendingCount", pendingCount);
            request.setAttribute("approvedCount", approvedCount);
            request.setAttribute("rejectedCount", rejectedCount);
            request.setAttribute("totalAmount", totalAmount);
            request.setAttribute("thisMonthAmount", thisMonthAmount);
            request.setAttribute("monthChange", String.format("%.1f", monthChange));
            request.setAttribute("isIncrease", isIncrease);
            request.setAttribute("approvalRate", String.format("%.1f", approvalRate));
            request.setAttribute("categoryData", categoryData);
            request.setAttribute("monthlyData", monthlyData);
            request.setAttribute("recentExpenses", recentExpenses);
            request.setAttribute("user", user);

            // Convert maps to JSON for charts
            request.setAttribute("categoryDataJson", gson.toJson(categoryData));
            request.setAttribute("monthlyDataJson", gson.toJson(monthlyData));

            // Forward to dashboard JSP
            request.getRequestDispatcher("/WEB-INF/jsp/dashboard.jsp").forward(request, response);

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error loading dashboard for user: " + user.getEmail(), e);
            request.setAttribute("error", "An error occurred while loading the dashboard. Please try again.");
            request.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(request, response);
        }
    }
}
