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
      marketData
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

export default router;
