// Frontend service for calling OpenRouter and market data APIs
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const aiService = {
  /**
   * Get AI analysis of market opportunity
   */
  async analyzeMarket(inputs, regionalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/analyze-market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, regionalData }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Market analysis error:', error);
      throw error;
    }
  },

  /**
   * Generate investor-ready feasibility report
   */
  async generateReport(inputs, results, regionalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, results, regionalData }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Report generation error:', error);
      throw error;
    }
  },

  /**
   * Get AI-powered investment recommendation
   */
  async getInvestmentRecommendation(inputs, results, regionalData, scraperData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/investment-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, results, regionalData, scraperData }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Investment recommendation error:', error);
      throw error;
    }
  },
};

export const dataService = {
  /**
   * Get all market data in one call
   */
  async getAllMarketData() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/all`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching all market data:', error);
      // Return fallback data
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Get graphene oxide and bagasse market prices
   */
  async getMarketPrices() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/market-prices`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw error;
    }
  },

  /**
   * Get regional electricity costs
   */
  async getRegionalElectricity() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/regional-electricity`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching electricity costs:', error);
      throw error;
    }
  },

  /**
   * Get government incentive schemes
   */
  async getIncentives() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/incentives`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching incentives:', error);
      throw error;
    }
  },

  /**
   * Get carbon credit market rates
   */
  async getCarbonRates() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/carbon-rates`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching carbon rates:', error);
      throw error;
    }
  },

  /**
   * Get bagasse market availability and pricing
   */
  async getBagasseMarket() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/bagasse-market`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching bagasse market data:', error);
      throw error;
    }
  },

  /**
   * Get recent market news and policy updates
   */
  async getMarketNews() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/market-news`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  },

  /**
   * Get backend-generated demand/price series
   */
  async getMarketSeries() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/market-series`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching market series:', error);
      throw error;
    }
  },
};

export default { aiService, dataService };
