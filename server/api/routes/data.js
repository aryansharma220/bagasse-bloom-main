import express from 'express';
import scraperService from '../../services/scraper.js';

const router = express.Router();

const buildMarketSeries = (prices, generatedAt) => {
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
  const demandStart = 120;
  const demandEnd = 1850;

  const avgPrice = Number(prices?.goPriceAvg || 130);
  const historicalStart = Math.max(avgPrice * 1.8, avgPrice + 60);

  const demandSeries = years.map((year, index) => {
    const t = index / (years.length - 1);
    const demand = Math.round(demandStart + (demandEnd - demandStart) * t * t);
    return { year: String(year), demand };
  });

  const priceSeries = years.map((year, index) => {
    const t = index / (years.length - 1);
    const price = Number((historicalStart + (avgPrice - historicalStart) * t).toFixed(1));
    return { year: String(year), price };
  });

  return {
    demandSeries,
    priceSeries,
    generatedAt: generatedAt || new Date().toISOString(),
  };
};

/**
 * GET /api/data/market-prices
 * Get current market prices for graphene oxide and bagasse
 */
router.get('/market-prices', async (req, res) => {
  try {
    const [goMarket, bagasseMarket, carbonRates] = await Promise.all([
      scraperService.getGrapheneOxideMarketData(),
      scraperService.getBagasseMarketData(),
      scraperService.getCarbonCreditRates(),
    ]);

    res.json({
      success: true,
      data: {
        grapheneOxide: goMarket,
        bagasse: bagasseMarket,
        carbonCredits: carbonRates,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch market prices',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/regional-electricity
 * Get current electricity costs by region
 */
router.get('/regional-electricity', async (req, res) => {
  try {
    const data = await scraperService.getRegionalElectricityCosts();

    res.json({
      success: true,
      data: {
        costs: data,
        unit: '₹/kWh',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Regional electricity error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch electricity costs',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/incentives
 * Get government incentive schemes and details
 */
router.get('/incentives', async (req, res) => {
  try {
    const incentives = await scraperService.getGovernmentIncentives();

    res.json({
      success: true,
      data: {
        schemes: incentives,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Incentives error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch incentives',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/carbon-rates
 * Get current carbon credit market rates
 */
router.get('/carbon-rates', async (req, res) => {
  try {
    const rates = await scraperService.getCarbonCreditRates();

    res.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    console.error('Carbon rates error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch carbon rates',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/bagasse-market
 * Get bagasse availability and pricing data
 */
router.get('/bagasse-market', async (req, res) => {
  try {
    const data = await scraperService.getBagasseMarketData();

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Bagasse market error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch bagasse market data',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/market-news
 * Get recent market news and policy updates
 */
router.get('/market-news', async (req, res) => {
  try {
    const news = await scraperService.getRecentMarketNews();

    res.json({
      success: true,
      data: {
        news: news,
        count: news.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Market news error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch market news',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/market-series
 * Get backend-generated demand and price time-series
 */
router.get('/market-series', async (req, res) => {
  try {
    const prices = await scraperService.getGrapheneOxideMarketData();
    const series = buildMarketSeries(prices, prices?.timestamp);

    res.json({
      success: true,
      data: series,
    });
  } catch (error) {
    console.error('Market series error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch market series',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/data/all
 * Get all market data in one call
 */
router.get('/all', async (req, res) => {
  try {
    const [prices, electricity, incentives, news] = await Promise.all([
      scraperService.getGrapheneOxideMarketData(),
      scraperService.getRegionalElectricityCosts(),
      scraperService.getGovernmentIncentives(),
      scraperService.getRecentMarketNews(),
    ]);
    const marketSeries = buildMarketSeries(prices, prices?.timestamp);

    res.json({
      success: true,
      data: {
        marketPrices: prices,
        marketSeries,
        electricity: electricity,
        incentives: incentives,
        news: news,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('All data error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch all market data',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
