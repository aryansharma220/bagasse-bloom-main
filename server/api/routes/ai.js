import express from 'express';
import openRouterService from '../../services/openrouter.js';
import scraperService from '../../services/scraper.js';
import { indianRegionalData } from '../../data/regional-data.js';

const router = express.Router();

/**
 * POST /api/ai/analyze-market
 * Get AI analysis of market opportunity for the scenario
 */
router.post('/analyze-market', async (req, res) => {
  try {
    const { inputs, regionalData } = req.body;

    if (!inputs) {
      return res.status(400).json({ error: 'Missing inputs' });
    }

    const analysis = await openRouterService.analyzeMarket(inputs, regionalData || indianRegionalData);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market analysis error:', error);
    res.status(500).json({
      error: error.message || 'Market analysis failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/ai/generate-report
 * Generate a feasibility report suitable for investors
 */
router.post('/generate-report', async (req, res) => {
  try {
    const { inputs, results, regionalData } = req.body;

    if (!inputs || !results) {
      return res.status(400).json({ error: 'Missing inputs or results' });
    }

    const report = await openRouterService.generateFeasibilityReport(
      inputs,
      results,
      regionalData || indianRegionalData
    );

    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      error: error.message || 'Report generation failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/ai/investment-recommendation
 * Get AI-powered investment recommendation
 */
router.post('/investment-recommendation', async (req, res) => {
  try {

    const { inputs, results, regionalData, scraperData } = req.body;

    if (!inputs || !results) {
      return res.status(400).json({ error: 'Missing inputs or results' });
    }

    let marketData = scraperData;
    if (!marketData) {
      const liveData = await scraperService.getLiveMarketIntelligence();
      marketData = {
        goPriceMin: liveData.grapheneOxide.priceUsdPerKg.min,
        goPriceMax: liveData.grapheneOxide.priceUsdPerKg.max,
        avgElectricityCost: liveData.electricityIndiaIndustrialInrPerKwh.TamilNadu,
        carbonCreditRate: liveData.carbonCredits.inrPerTonCo2.avg,
        bagasseCost: liveData.bagasseIndia.pricingInrPerTon.avg,
        confidence: liveData.confidence,
        generatedAt: liveData.generatedAt,
        sources: liveData.sources,
      };
    }

    const recommendation = await openRouterService.getInvestmentRecommendation(
      inputs,
      results,
      regionalData || indianRegionalData,
      marketData,
      question
    );

    res.json({
      success: true,
      data: recommendation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: error.message || 'Recommendation failed',
      timestamp: new Date().toISOString(),
    });
  }
});

 /*Ai assistant*/

import axios from "axios";

router.post('/chat', async (req, res) => {
  try {
    console.log("CHAT ROUTE HIT");
    console.log("API KEY:",process.env.OPENROUTER_API_KEY ? "FOUND" : "MISSING"),
      console.log("MODEL:",process.env.OPENROUTER_MODEL)

    const { message, inputs, results } = req.body;

    const prompt = `
You are a smart AI assistant.

User Question:
${message}

Project Inputs:
${JSON.stringify(inputs)}

Simulation Results:
${JSON.stringify(results)}

Answer clearly and differently each time.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "BioGraphX",
        },
      }
    );

    res.json({
      success: true,
      reply: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("CHAT ERROR FULL:", error.response?.data || error.message);

    res.status(500).json({
      error: "Chat failed",
    });
  }
});


export default router;