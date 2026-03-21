import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log('--- Server Starting ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('CWD:', process.cwd());
  
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 PDFs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Request logging for debugging
  app.use((req, res, next) => {
    if (!req.url.startsWith('/src/')) {
      console.log(`[Request] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  // API routes...
  app.post('/api/send-certificate', async (req, res) => {
    const { email, name, pdfBase64 } = req.body;

    if (!email || !pdfBase64) {
      return res.status(400).json({ error: 'Email and PDF are required' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured.');
      return res.status(503).json({ error: 'Email service not configured' });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const result = await resend.emails.send({
        from: 'IQTest Pro <workbro81@gmail.com>',
        to: email,
        subject: `Your IQ Test Certificate - ${name}`,
        text: `Hello ${name},\n\nPlease find your IQ Test Certificate attached.\n\nBest regards,\nIQTest Pro Team`,
        attachments: [
          {
            filename: `IQ_Certificate_${name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBase64.split('base64,')[1],
          },
        ],
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite...');
    try {
      vite = await createViteServer({
        root: process.cwd(),
        server: { 
          middlewareMode: true,
          watch: {
            usePolling: true,
            interval: 100
          }
        },
        appType: 'spa',
      });
      console.log('Vite initialized.');
      app.use(vite.middlewares);
    } catch (e) {
      console.error('Vite initialization failed:', e);
    }
  }
  
  // SPA Fallback for development
  if (process.env.NODE_ENV !== 'production' && vite) {
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      
      // If it's a request for a file with an extension (e.g. .tsx, .css), 
      // and it reached here, it means Vite didn't handle it.
      if (url.includes('.') && !url.endsWith('.html')) {
        return next();
      }

      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handler for JSON responses
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Payload too large. The certificate is too big to send via email.' });
    }
    res.status(err.status || 500).json({ 
      error: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('CRITICAL: Server failed to start:', err);
  process.exit(1);
});
