# Telegram Task Planner Mini-App - Project TODO

## Database & Schema
- [x] Create tasks table with event name, date/time, description, and user association
- [x] Create reminders table to track reminder schedules (1 day, 3h, 2h, 1h before event)
- [x] Create reminder_logs table to track sent reminders and prevent duplicates
- [x] Push database migrations with pnpm db:push

## Backend API
- [x] Add database query helpers for tasks CRUD operations
- [x] Add database query helpers for reminders management
- [x] Create tRPC procedures for task creation/update/delete/list
- [x] Create tRPC procedures for reminder scheduling and status tracking
- [x] Implement background job system to check and send reminders every minute
- [x] Integrate Telegram Bot API for sending reminder notifications

## Frontend UI
- [x] Design and implement calendar component for task viewing/planning
- [x] Create task creation form with date/time picker
- [x] Create task list view showing all scheduled tasks
- [x] Implement task editing functionality
- [x] Implement task deletion with confirmation
- [x] Add task details modal/panel
- [x] Create responsive mobile-first design for Telegram mini-app

## Telegram Integration
- [x] Set up Telegram bot token configuration
- [x] Implement bot message sending functionality
- [x] Test reminder notifications via Telegram bot
- [x] Ensure proper error handling and retry logic

## Authentication Refactor
- [x] Update users table schema to store only Telegram username
- [x] Remove Manus OAuth dependencies
- [x] Implement Telegram Web App authentication
- [x] Create login page with Telegram button
- [x] Update authentication hooks and context
- [x] Remove Manus login URL references
- [x] Test Telegram login flow

## Mobile Optimization
- [x] Fix header layout and spacing for mobile devices
- [x] Optimize calendar and task list layout for mobile
- [x] Improve touch interactions and button sizes
- [x] Add mobile-specific navigation
- [x] Test on various screen sizes

## Welcome Screen & Terms
- [x] Add terms table to database
- [x] Create API endpoints for terms
- [x] Create welcome screen component with animations
- [x] Implement terms acceptance flow
- [x] Add terms to database (seed data)
- [x] Remove Manus Auth from stack
- [x] Test welcome screen and animations

## Testing & Deployment
- [x] Test calendar functionality and date/time selection
- [x] Test task creation, editing, and deletion
- [x] Test reminder scheduling and notification delivery
- [x] Verify responsive design on mobile devices
- [x] Test Telegram authentication flow
- [x] Redesign login page with "Continue with Telegram" button
- [x] Fix authentication flow (Login -> Terms -> Home)
- [x] Create checkpoint and prepare for deployment
