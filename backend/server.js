const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

// --------------------------------------------------
// IMAGE UPLOAD
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// --------------------------------------------------
// GEMINI
// --------------------------------------------------

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "EcoWorth AI backend is running",
    status: "online",
  });
});

// --------------------------------------------------
// AI WASTE ANALYSIS
// --------------------------------------------------

app.post(
  "/api/analyze-waste",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image uploaded",
        });
      }

      console.log(
        `📷 Received image: ${req.file.originalname}`,
      );

      const base64Image =
        req.file.buffer.toString("base64");

      const prompt = `
You are the AI waste intelligence engine for EcoWorth AI.

Analyze the uploaded image carefully.

Your task is NOT simply to identify the object.

Determine whether the image actually shows WASTE.

Important rules:

1. A normal object being used normally is NOT waste.
2. A normal laptop, phone, bottle, bag, box, etc. is NOT automatically waste.
3. A broken, damaged, abandoned, discarded, or unwanted object can be waste.
4. A laptop or phone that is discarded or damaged should be classified as e-waste.
5. Food scraps being discarded are organic waste.
6. Cardboard, paper, plastic, glass, and metal that are clearly discarded can be waste.
7. If there is not enough visual evidence that the object is waste, prefer isWaste=false.
8. Do not invent details that cannot be seen in the image.

Determine:

- whether it is waste
- waste type
- category
- confidence
- condition
- recovery potential
- best recommended action
- explanation
- handling instructions
- whether special collection is required

Recommended actions must be one of:

reuse
repair
recycle
upcycle
compost
dispose
e_waste_collection

Use these general rules:

- Repairable item → repair
- Reusable item → reuse
- Recyclable plastic/paper/cardboard/glass/metal → recycle
- Organic/food waste → compost
- Electronic waste → e_waste_collection
- Item suitable for creative conversion → upcycle
- Unrecoverable waste → dispose

Return ONLY valid JSON.

Use exactly this structure:

{
  "isWaste": true,
  "wasteType": "string",
  "category": "string",
  "confidence": 0,
  "condition": "string",
  "recoveryPotential": "low | medium | high",
  "recommendedAction": "reuse | repair | recycle | upcycle | compost | dispose | e_waste_collection",
  "reason": "string",
  "handling": "string",
  "needsCollection": true
}
`;

      const models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash-lite",
      ];

      let response = null;
      let lastError = null;

      for (const model of models) {
        try {
          console.log(
            `🤖 Trying Gemini model: ${model}`,
          );

          response =
            await ai.models.generateContent({
              model,
              contents: [
                {
                  inlineData: {
                    mimeType:
                      req.file.mimetype,
                    data: base64Image,
                  },
                },
                {
                  text: prompt,
                },
              ],
              config: {
                responseMimeType:
                  "application/json",
              },
            });

          console.log(
            `✅ Gemini response received from ${model}`,
          );

          break;
        } catch (error) {
          lastError = error;

          console.error(
            `❌ ${model} failed:`,
            error?.message || error,
          );
        }
      }

      if (!response) {
        console.error(
          "❌ All Gemini models failed.",
        );

        return res.status(503).json({
          success: false,
          error:
            "AI service is temporarily unavailable. Please try again.",
          details:
            lastError?.message ||
            "All Gemini models failed.",
        });
      }

      const text =
        typeof response.text === "function"
          ? response.text()
          : response.text;

      if (!text) {
        return res.status(500).json({
          success: false,
          error:
            "Gemini returned an empty response.",
        });
      }

      console.log(
        "🧠 Gemini raw response:",
        text,
      );

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let result;

      try {
        result = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error(
          "❌ Could not parse Gemini JSON:",
          parseError,
        );

        return res.status(500).json({
          success: false,
          error:
            "AI returned an invalid analysis format.",
          raw: cleanedText,
        });
      }

      return res.json({
        success: true,
        analysis: result,
      });

    } catch (error) {
      console.error(
        "❌ Waste analysis error:",
        error,
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to analyze the waste image.",
        details:
          error?.message ||
          "Unknown server error",
      });
    }
  },
);

// --------------------------------------------------
// EXPORT FOR VERCEL
// --------------------------------------------------

// IMPORTANT:
// Do NOT use app.listen() on Vercel.
// Vercel handles the server automatically.

module.exports = app;
