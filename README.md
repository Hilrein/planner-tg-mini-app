# Telegram Task Planner Mini-App

A full-featured web application for planning tasks and receiving automated Telegram reminders. Schedule your events and get notified 1 day, 3 hours, 2 hours, and 1 hour before each task.

## Features

**Task Management**
- Create, view, edit, and delete tasks with ease
- Set task titles, descriptions, dates, and times
- Support for multiple timezones
- Beautiful calendar interface for date selection

**Smart Reminders**
- Automatic reminders sent via Telegram at four key intervals:
  - 1 day before the event
  - 3 hours before the event
  - 2 hours before the event
  - 1 hour before the event
- Real-time background job system checking reminders every minute
- Prevents duplicate notifications

**User Experience**
- Responsive design optimized for mobile and desktop
- Intuitive calendar with task count indicators
- Quick task overview showing time until event
- Secure authentication via Manus OAuth

## Getting Started

### Prerequisites

- Telegram account
- A Telegram bot token (created via BotFather)

### Setup Instructions

#### 1. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/start` to begin
3. Send `/newbot` to create a new bot
4. Follow the prompts to name your bot
5. Copy the **API token** provided (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 2. Connect Your Telegram Account

1. Start your bot by sending any message to it on Telegram
2. Log in to the Task Planner web app
3. The app will automatically register your Telegram chat ID
4. You're ready to start planning!

#### 3. Create Your First Task

1. Click the **"New Task"** button
2. Enter task details:
   - **Title**: What you need to do
   - **Description**: Optional details
   - **Date**: When the task is scheduled
   - **Time**: What time the task occurs
   - **Timezone**: Your local timezone
3. Click **"Create Task"**
4. You'll receive Telegram reminders at the scheduled times

## How Reminders Work

The application runs a background job that checks for pending reminders every minute. When a reminder is due:

1. The system identifies tasks with reminders scheduled for the current time
2. Sends a formatted message to your Telegram account via the bot
3. Marks the reminder as sent to prevent duplicates
4. Logs the action for debugging

### Reminder Message Format

Each reminder includes:
- A friendly reminder indicator (⏰)
- Time until the event
- Task title in bold

Example: `⏰ Reminder: Your task is in 1 hour!\n\n**Team Meeting**`

## Technical Architecture

### Database Schema

**Tasks Table**
- Stores user tasks with title, description, scheduled time, and timezone
- Linked to users for multi-user support

**Reminders Table**
- Tracks four reminder times per task (1 day, 3h, 2h, 1h before)
- Tracks sent status to prevent duplicates
- Records when each reminder was sent

**Telegram Users Table**
- Maps user accounts to Telegram chat IDs
- Enables secure message delivery

### Backend Services

**tRPC Procedures**
- `tasks.list`: Fetch all user tasks
- `tasks.create`: Create a new task with automatic reminder generation
- `tasks.update`: Update task details
- `tasks.delete`: Remove a task and associated reminders
- `telegram.registerChatId`: Link Telegram account to user

**Background Jobs**
- Reminder job runs every 60 seconds
- Fetches unsent reminders due for delivery
- Sends Telegram messages via bot API
- Marks reminders as sent upon successful delivery

### Frontend Components

**Calendar Component**
- Interactive month view with navigation
- Shows task count indicators on dates with events
- Highlights selected date and today's date
- Click to filter tasks by date

**Task Form Component**
- Modal dialog for creating/editing tasks
- Date and time pickers
- Timezone selector with common options
- Form validation

**Task List Component**
- Displays tasks sorted by scheduled time
- Shows time until event (e.g., "3h away", "Overdue")
- Edit and delete actions
- Empty state when no tasks exist

## Environment Variables

The following environment variables are automatically configured:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot API token
- `DATABASE_URL`: MySQL/TiDB connection string
- `JWT_SECRET`: Session signing secret
- `VITE_APP_TITLE`: Application title
- `VITE_APP_LOGO`: Application logo URL

## Troubleshooting

### Reminders Not Arriving

1. **Verify bot token**: Ensure the Telegram bot token is correctly set in environment variables
2. **Check chat ID registration**: Make sure you've sent a message to your bot to register your chat ID
3. **Review logs**: Check server logs for reminder job execution and any error messages
4. **Timezone accuracy**: Verify your timezone setting matches your local time

### Tasks Not Appearing

1. **Refresh page**: Clear browser cache and reload
2. **Check authentication**: Ensure you're logged in with the correct account
3. **Database connection**: Verify the database is accessible

### Bot Not Responding

1. **Start the bot**: Send any message to your bot on Telegram to activate it
2. **Verify token**: Double-check the bot token hasn't expired or been regenerated
3. **Check permissions**: Ensure the bot has message sending permissions

## Development

### Project Structure

```
client/
  src/
    components/     # Reusable UI components
    pages/          # Page-level components
    types/          # TypeScript type definitions
    lib/            # Utility functions and tRPC client

server/
  db.ts             # Database query helpers
  routers.ts        # tRPC procedure definitions
  jobs/             # Background job implementations
  _core/            # Framework and initialization

drizzle/
  schema.ts         # Database schema definitions
```

### Running Locally

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## API Reference

### Create Task

```typescript
trpc.tasks.create.useMutation({
  title: "Team Meeting",
  description: "Quarterly review",
  scheduledAt: new Date("2025-12-01T14:00:00"),
  timezone: "America/New_York"
})
```

### Register Telegram Chat ID

```typescript
trpc.telegram.registerChatId.useMutation({
  telegramChatId: "123456789",
  telegramUserId: "user123"
})
```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Ensure Telegram bot permissions are enabled

## License

This project is provided as-is for personal use.

## Future Enhancements

- Task categories and tags
- Recurring tasks
- Task completion tracking
- Reminder customization per task
- Integration with calendar services (Google Calendar, Outlook)
- Mobile app version
- Task priorities and sorting options
