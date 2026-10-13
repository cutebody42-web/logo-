import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client with telemetry header as required by guideline
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

/**
 * Feature 1: Create & edit images using gemini-nano-banana-2.1
 * Supports:
 * - Text-to-image creation (e.g. logos, graphics, scene mockups)
 * - Image-to-image editing (text prompt + source image inlineData)
 */
app.post('/api/nano-banana', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '1:1', imageSize = '1K' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();
    const parts: any[] = [];

    // If source image is provided, include it for editing mode
    if (imageBase64 && typeof imageBase64 === 'string') {
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanData,
          mimeType: mimeType || 'image/png',
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let textResponse = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(422).json({
        error: textResponse || 'The model completed without generating an image. Please refine your prompt.',
        textResponse,
      });
    }

    return res.json({
      imageUrl,
      model: 'gemini-nano-banana-2.1',
      prompt,
      textResponse,
    });
  } catch (err: any) {
    console.error('Error in /api/nano-banana:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate/edit image with gemini-nano-banana-2.1',
    });
  }
});

/**
 * Feature 2: High-Quality Image Generation with gemini-3-pro-image-preview
 * Supports:
 * - Affordance for 1K, 2K, and 4K imageSize
 * - Configurable aspect ratio
 * - Optional reference mockup / logo input
 */
app.post('/api/generate-high-quality', async (req, res) => {
  try {
    const {
      prompt,
      imageSize = '1K', // Must support 1K, 2K, 4K
      aspectRatio = '1:1',
      referenceImageBase64,
      mimeType = 'image/png',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const ai = getGeminiClient();
    const parts: any[] = [];

    if (referenceImageBase64 && typeof referenceImageBase64 === 'string') {
      const cleanData = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanData,
          mimeType: mimeType || 'image/png',
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let textResponse = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(422).json({
        error: textResponse || 'The model did not return an image. Please try again.',
        textResponse,
      });
    }

    return res.json({
      imageUrl,
      model: 'gemini-3-pro-image-preview',
      imageSize: chosenSize,
      aspectRatio,
      prompt,
      textResponse,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-high-quality:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate high-quality image with gemini-3-pro-image-preview',
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
