import { createApp } from '../dist/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createApp();

// In Vercel, static files are served automatically from outputDirectory
// We only need to handle SPA routing fallback to index.html
// API routes are already handled by the tRPC middleware in createApp()
app.use('*', (req, res, next) => {
  // Skip API routes - they're handled by tRPC middleware
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // For SPA routing, serve index.html
  // In Vercel, static files are served automatically, so this only handles non-existent routes
  const indexPath = path.resolve(__dirname, '..', 'dist', 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

export default app;
