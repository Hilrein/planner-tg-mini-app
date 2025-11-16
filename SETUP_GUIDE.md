# Telegram Task Planner - Setup Guide

Follow these steps to get your Telegram Task Planner up and running.

## Step 1: Create a Telegram Bot

### Via BotFather (Recommended)

1. **Open Telegram** and search for `@BotFather`
2. **Start the bot** by clicking "Start" or typing `/start`
3. **Create a new bot** by typing `/newbot`
4. **Name your bot** (e.g., "My Task Planner Bot")
5. **Choose a username** (must end with "bot", e.g., "my_task_planner_bot")
6. **Copy the API token** that BotFather provides

The token will look like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### Save Your Token

Keep this token safe! You'll need it to configure the application.

## Step 2: Configure the Application

### Option A: Environment Variables (Recommended for Deployment)

Set the `TELEGRAM_BOT_TOKEN` environment variable with your bot token:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
```

### Option B: Through Management Dashboard

1. Log in to the application
2. Navigate to **Settings → Secrets**
3. Add a new secret:
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Your bot token from BotFather
4. Save and restart the server

## Step 3: Connect Your Telegram Account

### First-Time Setup

1. **Open Telegram** and find your bot (search for the username you created)
2. **Send a message** to your bot (any message, like "Hi" or "/start")
3. **Log in** to the Task Planner web application
4. The app will automatically detect your Telegram chat ID
5. You should see a confirmation message

### Verify Connection

After logging in:
- Create a test task scheduled for 1 minute from now
- Wait for the reminder notification in Telegram
- If you receive it, your connection is working!

## Step 4: Start Planning Tasks

### Creating Your First Task

1. Click the **"+ New Task"** button in the top right
2. Fill in the task details:
   - **Task Title** (required): What you need to do
   - **Description** (optional): Additional details
   - **Date** (required): When the task is scheduled
   - **Time** (required): What time the task occurs
   - **Timezone**: Select your timezone from the dropdown
3. Click **"Create Task"**

### Understanding the Calendar

- **Calendar View**: Shows all months with navigation arrows
- **Task Indicators**: Dates with tasks show a number indicating task count
- **Selected Date**: Click any date to filter tasks for that day
- **Today's Date**: Highlighted in a different color

### Managing Tasks

**View Tasks**
- All tasks appear in the right panel
- Click a date on the calendar to filter by that date
- Tasks are sorted by scheduled time

**Delete a Task**
- Click the **"Delete"** button on any task card
- The task and all associated reminders will be removed

**Edit a Task**
- Click the **"Edit"** button on any task card
- Update the details and save

## Step 5: Understand Reminder Notifications

### When You'll Get Reminders

For each task, you'll receive **4 automatic reminders**:

| Reminder | When | Example |
|----------|------|---------|
| 1 Day Before | 24 hours before event | Monday 2:00 PM for Tuesday 2:00 PM event |
| 3 Hours Before | 3 hours before event | Tuesday 11:00 AM for Tuesday 2:00 PM event |
| 2 Hours Before | 2 hours before event | Tuesday 12:00 PM for Tuesday 2:00 PM event |
| 1 Hour Before | 1 hour before event | Tuesday 1:00 PM for Tuesday 2:00 PM event |

### Reminder Message Format

Each reminder includes:
- A clock emoji (⏰) indicating it's a reminder
- Time until the event
- Your task title in bold

Example message:
```
⏰ Reminder: Your task is in 1 hour!

Team Meeting
```

### Timezone Handling

- All reminders are calculated based on your selected timezone
- The system converts your scheduled time to UTC for storage
- Reminders are sent at the correct local time

## Troubleshooting

### "No tasks scheduled" Message

This appears when:
- You haven't created any tasks yet
- You've selected a date with no tasks
- All tasks have been deleted

**Solution**: Click "New Task" to create your first task.

### Not Receiving Reminders

**Check 1: Bot is Active**
- Open Telegram and send a message to your bot
- You should see it in your chat history

**Check 2: Chat ID is Registered**
- Log in to the web app
- Check that you're logged in with the correct account
- Try refreshing the page

**Check 3: Task Time is Correct**
- Verify the task date and time are in the future
- Check that your timezone is set correctly
- Ensure the time format is correct (24-hour)

**Check 4: Reminders Haven't Been Sent Yet**
- Reminders are sent at specific times before the event
- If your event is tomorrow, the 1-day reminder will come tomorrow at the same time
- Check back closer to the event time

### Bot Token Issues

**Token Not Working**
- Verify the token is copied exactly from BotFather
- Check for extra spaces or characters
- Regenerate the token in BotFather if needed

**"Invalid Token" Error**
- Ensure the token format is correct (numbers:letters-numbers)
- Try regenerating the token through BotFather
- Restart the application after updating the token

### Timezone Problems

**Reminders at Wrong Time**
1. Check your timezone setting in the task form
2. Verify your local system time is correct
3. Select the correct timezone from the dropdown
4. Common timezones:
   - `America/New_York` (EST/EDT)
   - `America/Chicago` (CST/CDT)
   - `America/Denver` (MST/MDT)
   - `America/Los_Angeles` (PST/PDT)
   - `Europe/London` (GMT/BST)
   - `Europe/Paris` (CET/CEST)
   - `Asia/Tokyo` (JST)
   - `Asia/Dubai` (GST)

## Tips & Best Practices

### Organizing Tasks

- **Use descriptive titles**: "Team Meeting with Marketing" is better than "Meeting"
- **Add descriptions**: Include agenda items or meeting links in the description
- **Set realistic times**: Account for preparation time before events

### Managing Reminders

- **Check your timezone**: Incorrect timezone is the most common issue
- **Test with a short task**: Create a task 5 minutes from now to test reminders
- **Keep bot active**: Ensure your Telegram bot is running and accessible

### Productivity Tips

- **Review daily**: Check the calendar each morning for your day's tasks
- **Set recurring tasks manually**: Create similar tasks for regular meetings
- **Use descriptions for context**: Include meeting links, locations, or notes
- **Delete completed tasks**: Keep your list clean by removing old tasks

## Getting Help

### Common Issues

| Issue | Solution |
|-------|----------|
| "No tasks scheduled" | Create a new task using the "+ New Task" button |
| Reminders not arriving | Verify bot token and send a message to your bot |
| Wrong reminder time | Check your timezone setting in the task form |
| Can't see tasks | Refresh the page or check if you're logged in |
| Bot not responding | Restart the bot or regenerate the token |

### Advanced Troubleshooting

**Check Server Logs**
- Look for error messages in the server console
- Check if the reminder job is running
- Verify database connectivity

**Test Bot Directly**
- Send a message to your bot in Telegram
- You should receive a response if the bot is working
- If not, the token may be invalid

**Verify Database**
- Ensure the database is accessible
- Check that tasks are being saved correctly
- Verify reminders table has entries for your tasks

## Next Steps

1. **Create your first task** and verify you receive reminders
2. **Explore the calendar** to plan your week
3. **Customize your timezone** for accurate reminder times
4. **Share feedback** on features you'd like to see

Enjoy planning your tasks with Telegram reminders!
