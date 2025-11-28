package com.expensemgmt.servlet;

import com.expensemgmt.dao.ExpenseDAO;
import com.expensemgmt.dao.CategoryDAO;
import com.expensemgmt.dao.StoreDAO;
import com.expensemgmt.model.Expense;
import com.expensemgmt.model.User;
import com.expensemgmt.model.Category;
import com.expensemgmt.model.Store;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Expense servlet for managing expense CRUD operations
 */
@WebServlet("/expenses/*")
public class ExpenseServlet extends HttpServlet {
    private static final Logger logger = Logger.getLogger(ExpenseServlet.class.getName());
    private ExpenseDAO expenseDAO;
    private CategoryDAO categoryDAO;
    private StoreDAO storeDAO;

    @Override
    public void init() throws ServletException {
        expenseDAO = new ExpenseDAO();
        categoryDAO = new CategoryDAO();
        storeDAO = new StoreDAO();
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
        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // List all expenses
                listExpenses(request, response, user);
            } else if (pathInfo.equals("/new")) {
                // Show create form
                showCreateForm(request, response, user);
            } else if (pathInfo.matches("/\\d+/edit")) {
                // Show edit form
                String id = pathInfo.split("/")[1];
                showEditForm(request, response, user, id);
            } else {
                // Show expense details
                String id = pathInfo.substring(1);
                showExpenseDetails(request, response, user, id);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error in ExpenseServlet doGet", e);
            request.setAttribute("error", "An error occurred while processing your request.");
            request.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        User user = (User) session.getAttribute("user");
        String pathInfo = request.getPathInfo();
        String method = request.getParameter("_method");

        try {
            if ("PUT".equals(method) && pathInfo != null && pathInfo.matches("/\\d+")) {
                // Update expense
                String id = pathInfo.substring(1);
                updateExpense(request, response, user, id);
            } else if ("DELETE".equals(method) && pathInfo != null && pathInfo.matches("/\\d+")) {
                // Delete expense
                String id = pathInfo.substring(1);
                deleteExpense(request, response, user, id);
            } else {
                // Create new expense
                createExpense(request, response, user);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error in ExpenseServlet doPost", e);
            request.setAttribute("error", "An error occurred while processing your request.");
            request.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(request, response);
        }
    }

    private void listExpenses(HttpServletRequest request, HttpServletResponse response, User user)
            throws Exception {

        String status = request.getParameter("status");
        String categoryId = request.getParameter("category");
        String pageStr = request.getParameter("page");
        int page = pageStr != null ? Integer.parseInt(pageStr) : 1;
        int limit = 10;
        int offset = (page - 1) * limit;

        // Get expenses based on user role
        List<Expense> expenses;
        int totalCount;

        if (user.getRole() == User.Role.ADMIN) {
            // Admin sees all expenses in organization
            expenses = expenseDAO.getExpensesByOrganization(user.getOrganizationId(), status, categoryId, limit, offset);
            totalCount = expenseDAO.getExpenseCountByOrganization(user.getOrganizationId(), status, categoryId);
        } else {
            // Regular users see only their expenses
            expenses = expenseDAO.getExpensesByUser(user.getId(), status, categoryId, limit, offset);
            totalCount = expenseDAO.getExpenseCountByUser(user.getId(), status, categoryId);
        }

        // Get categories for filter
        List<Category> categories = categoryDAO.getByOrganizationId(user.getOrganizationId());

        int totalPages = (int) Math.ceil((double) totalCount / limit);

        request.setAttribute("expenses", expenses);
        request.setAttribute("categories", categories);
        request.setAttribute("currentPage", page);
        request.setAttribute("totalPages", totalPages);
        request.setAttribute("totalCount", totalCount);
        request.setAttribute("status", status);
        request.setAttribute("categoryId", categoryId);
        request.setAttribute("user", user);

        request.getRequestDispatcher("/WEB-INF/jsp/expenses/list.jsp").forward(request, response);
    }

    private void showCreateForm(HttpServletRequest request, HttpServletResponse response, User user)
            throws Exception {

        List<Category> categories = categoryDAO.getByOrganizationId(user.getOrganizationId());
        List<Store> stores = storeDAO.getByOrganizationId(user.getOrganizationId());

        request.setAttribute("categories", categories);
        request.setAttribute("stores", stores);
        request.setAttribute("user", user);

        request.getRequestDispatcher("/WEB-INF/jsp/expenses/create.jsp").forward(request, response);
    }

    private void showEditForm(HttpServletRequest request, HttpServletResponse response, User user, String expenseId)
            throws Exception {

        Expense expense = expenseDAO.findById(expenseId);

        // Check if user can edit this expense
        if (expense == null || (!user.getId().equals(expense.getUserId()) && user.getRole() != User.Role.ADMIN)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        List<Category> categories = categoryDAO.getByOrganizationId(user.getOrganizationId());
        List<Store> stores = storeDAO.getByOrganizationId(user.getOrganizationId());

        request.setAttribute("expense", expense);
        request.setAttribute("categories", categories);
        request.setAttribute("stores", stores);
        request.setAttribute("user", user);

        request.getRequestDispatcher("/WEB-INF/jsp/expenses/edit.jsp").forward(request, response);
    }

    private void showExpenseDetails(HttpServletRequest request, HttpServletResponse response, User user, String expenseId)
            throws Exception {

        Expense expense = expenseDAO.findById(expenseId);

        // Check if user can view this expense
        if (expense == null || (!user.getId().equals(expense.getUserId()) && user.getRole() != User.Role.ADMIN)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        request.setAttribute("expense", expense);
        request.setAttribute("user", user);

        request.getRequestDispatcher("/WEB-INF/jsp/expenses/detail.jsp").forward(request, response);
    }

    private void createExpense(HttpServletRequest request, HttpServletResponse response, User user)
            throws Exception {

        String title = request.getParameter("title");
        String amountStr = request.getParameter("amount");
        String currency = request.getParameter("currency");
        String dateStr = request.getParameter("date");
        String notes = request.getParameter("notes");
        String categoryId = request.getParameter("categoryId");
        String storeId = request.getParameter("storeId");

        // Validation
        if (title == null || title.trim().isEmpty()) {
            request.setAttribute("error", "Title is required");
            showCreateForm(request, response, user);
            return;
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(amountStr);
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid amount");
            showCreateForm(request, response, user);
            return;
        }

        Date date;
        try {
            date = Date.valueOf(dateStr);
        } catch (IllegalArgumentException e) {
            request.setAttribute("error", "Invalid date format");
            showCreateForm(request, response, user);
            return;
        }

        Expense expense = new Expense();
        expense.setId(UUID.randomUUID().toString());
        expense.setTitle(title.trim());
        expense.setAmount(amount);
        expense.setCurrency(currency != null ? currency : "INR");
        expense.setDate(date);
        expense.setNotes(notes != null ? notes.trim() : null);
        expense.setStatus(Expense.Status.PENDING);
        expense.setUserId(user.getId());
        expense.setOrganizationId(user.getOrganizationId());
        expense.setCategoryId(categoryId != null && !categoryId.isEmpty() ? categoryId : null);
        expense.setStoreId(storeId != null && !storeId.isEmpty() ? storeId : null);

        expenseDAO.create(expense);

        logger.info("Expense created successfully: " + expense.getId() + " by user: " + user.getEmail());
        response.sendRedirect(request.getContextPath() + "/expenses");
    }

    private void updateExpense(HttpServletRequest request, HttpServletResponse response, User user, String expenseId)
            throws Exception {

        Expense existingExpense = expenseDAO.findById(expenseId);

        // Check if user can update this expense
        if (existingExpense == null || (!user.getId().equals(existingExpense.getUserId()) && user.getRole() != User.Role.ADMIN)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String title = request.getParameter("title");
        String amountStr = request.getParameter("amount");
        String currency = request.getParameter("currency");
        String dateStr = request.getParameter("date");
        String notes = request.getParameter("notes");
        String categoryId = request.getParameter("categoryId");
        String storeId = request.getParameter("storeId");

        // Validation
        if (title == null || title.trim().isEmpty()) {
            request.setAttribute("error", "Title is required");
            showEditForm(request, response, user, expenseId);
            return;
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(amountStr);
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid amount");
            showEditForm(request, response, user, expenseId);
            return;
        }

        Date date;
        try {
            date = Date.valueOf(dateStr);
        } catch (IllegalArgumentException e) {
            request.setAttribute("error", "Invalid date format");
            showEditForm(request, response, user, expenseId);
            return;
        }

        existingExpense.setTitle(title.trim());
        existingExpense.setAmount(amount);
        existingExpense.setCurrency(currency != null ? currency : "INR");
        existingExpense.setDate(date);
        existingExpense.setNotes(notes != null ? notes.trim() : null);
        existingExpense.setCategoryId(categoryId != null && !categoryId.isEmpty() ? categoryId : null);
        existingExpense.setStoreId(storeId != null && !storeId.isEmpty() ? storeId : null);

        expenseDAO.update(existingExpense);

        logger.info("Expense updated successfully: " + expenseId + " by user: " + user.getEmail());
        response.sendRedirect(request.getContextPath() + "/expenses/" + expenseId);
    }

    private void deleteExpense(HttpServletRequest request, HttpServletResponse response, User user, String expenseId)
            throws Exception {

        Expense expense = expenseDAO.findById(expenseId);

        // Check if user can delete this expense
        if (expense == null || (!user.getId().equals(expense.getUserId()) && user.getRole() != User.Role.ADMIN)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        expenseDAO.delete(expenseId);

        logger.info("Expense deleted successfully: " + expenseId + " by user: " + user.getEmail());
        response.sendRedirect(request.getContextPath() + "/expenses");
    }
}
