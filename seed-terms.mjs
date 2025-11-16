import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const terms = [
  {
    title: 'Terms of Service',
    content: 'By using this application, you agree to our terms of service. This application is provided as-is for task planning and reminder purposes. Users are responsible for ensuring accuracy of their scheduled tasks and times.',
    order: 1,
  },
  {
    title: 'Privacy Policy',
    content: 'We collect only your Telegram username for authentication purposes. Your tasks and reminders are stored securely and are not shared with third parties. We use this data solely to provide reminder notifications via Telegram.',
    order: 2,
  },
  {
    title: 'Notification Consent',
    content: 'You consent to receive reminder notifications via Telegram bot at the scheduled times (1 day, 3 hours, 2 hours, and 1 hour before your events). You can manage notification preferences in your account settings.',
    order: 3,
  },
];

for (const term of terms) {
  await connection.execute(
    'INSERT INTO terms (title, content, `order`, active) VALUES (?, ?, ?, 1)',
    [term.title, term.content, term.order]
  );
}

console.log('Terms seeded successfully!');
await connection.end();
