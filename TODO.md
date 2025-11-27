# TODO: Update Policies Page to Show Categories with Associated Policies

- [x] Update prisma/schema.prisma to add categoryId to Policy model
- [x] Run database migration for schema changes
- [x] Update src/app/policies/page.tsx to fetch policies with categories and display grouped by category
- [x] Update add policy form to include category selection
- [x] Test the updated policies page functionality (app running on localhost:3000)

# TODO: Implement Notification System for Admins

- [x] Update prisma/schema.prisma to add Notification model with fields: id, message, senderId, organizationId, createdAt
- [x] Create API route src/app/api/notifications/send/route.ts for POST requests to send notifications
- [x] Create component src/components/NotificationModal.tsx for composing and sending notifications
- [x] Update src/app/dashboard/page.tsx to add notification bell icon for admins and integrate modal
- [x] Run npx prisma generate after schema changes
- [x] Test notification sending functionality
