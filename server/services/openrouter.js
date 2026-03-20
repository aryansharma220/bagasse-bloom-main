import axios from 'axios';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  constructor() {
    this.baseUrl = OPENROUTER_BASE_URL;
  }

  getModel() {
    return process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
  }

  getApiKey() {
    return process.env.OPENROUTER_API_KEY;
  }

  getInrPerUsd() {
    return Number(process.env.INR_PER_USD || 83);
  }

  formatInr(value, digits = 0) {
    const inrValue = Number(value || 0) * this.getInrPerUsd();
    return `₹${inrValue.toLocaleString('en-IN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}`;
  }

  getClient() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required for AI endpoints');
    }

    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate market analysis using AI
   * Analyzes bagasse, graphene oxide market trends and business viability
   */
  async analyzeMarket(inputs, regionalData) {
    try {
      const prompt = this.buildMarketAnalysisPrompt(inputs, regionalData);
      const client = this.getClient();
      
      const response = await client.post('/chat/completions', {
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: 'You are an expert in industrial biotech, graphene oxide production, and Indian market analysis. Provide data-driven insights based on current market trends.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        analysis: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('OpenRouter market analysis error:', error.message);
      throw new Error(`Market analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate investor-ready feasibility report
   */
  async generateFeasibilityReport(inputs, results, regionalData) {
    try {
      const prompt = this.buildReportPrompt(inputs, results, regionalData);
      const client = this.getClient();
      
      const response = await client.post('/chat/completions', {
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst and technical consultant. Generate professional, banker-friendly feasibility analysis for a bagasse-to-graphene oxide venture.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      });

      return {
        report: response.data.choices[0].message.content,
        model: response.data.model,
      };
    } catch (error) {
      console.error('OpenRouter report generation error:', error.message);
      throw new Error(`Report generation failed: ${error.message}`);
    }
  }

  /**
   * Get AI-powered investment recommendation
   */
  async getInvestmentRecommendation(inputs, results, regionalData, scraperData) {
    try {
      const prompt = this.buildRecommendationPrompt(inputs, results, regionalData, scraperData);
      const client = this.getClient();
      
      const response = await client.post('/chat/completions', {
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: 'You are a venture capital analyst specializing in deep-tech and climate-tech in India. Provide clear investment recommendations with risk assessment.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 800,
      });

      return {
        recommendation: response.data.choices[0].message.content,
        model: response.data.model,
      };
    } catch (error) {
      console.error('OpenRouter recommendation error:', error.message);
      throw new Error(`Recommendation failed: ${error.message}`);
    }
  }

  buildMarketAnalysisPrompt(inputs, regionalData) {
    return `
Analyze the business viability and market opportunity for a bagasse-to-graphene oxide production facility in India with these parameters:

PROJECT PARAMETERS:
- Daily Capacity: ${inputs.dailyCapacity} tons/day of bagasse
- Input Moisture: ${inputs.inputMoisture}%
- GO Price: ${this.formatInr(inputs.goPrice)}/kg (India benchmark)
- Region Selected: ${inputs.selectedRegion}
- Electricity Cost: ${this.formatInr(inputs.electricityCost, 2)}/kWh
- Labor Cost: ${this.formatInr(inputs.laborCost)}/day

REGIONAL DATA:
${Object.entries(regionalData).map(([key, region]) => 
  `${region.state}: ${this.formatInr(region.electricityCost, 2)}/kWh electricity, ${(Number(region.bagasseAvailability) / 1_000_000).toFixed(1)}M tons/year feedstock, Incentives: ${region.majorIncentives.join(', ')}`
).join('\n')}

MARKET CONTEXT:
- India GO market benchmark: ₹8,000-₹22,000/kg (depends on purity and specs)
- India GO demand: Growing in batteries, composites, water treatment, coatings
- Bagasse availability: ~40M tons/year in India, large underutilized share
- Carbon credits in India: typically ₹150-₹300/ton CO2 saved (varies by program)

Questions to address:
1. What are the realistic market dynamics for this venture?
2. What regional advantages and challenges exist?
3. What are the timing and scalability factors?
4. Are there emerging competitors or technologies we should monitor?
5. What's the investor appeal and risk profile?

Provide specific, actionable insights.
    `;
  }

  buildReportPrompt(inputs, results, regionalData) {
    return `
Generate a professional feasibility report for investment decision-making. The venture:

PROJECT DETAILS:
- Daily Capacity: ${inputs.dailyCapacity} tons/day
- GO Production: ${results.goProducedYearly?.toLocaleString()} kg/year
- Yearly Revenue: ${this.formatInr(results.yearlyRevenue)}
- Yearly Profit: ${this.formatInr(results.yearlyProfit)}
- ROI: ${results.roiPercent?.toFixed(1)}%
- Payback Period: ${results.paybackYears?.toFixed(1)} years

FINANCIAL ASSUMPTIONS:
- GO Selling Price: ${this.formatInr(inputs.goPrice)}/kg
- Electricity Cost: ${this.formatInr(inputs.electricityCost, 2)}/kWh
- Labor Cost: ${this.formatInr(inputs.laborCost)}/day
- Carbon Credit Value: ${this.formatInr(inputs.carbonCreditValue)}/ton CO2

CARBON BENEFITS:
- CO2 Saved Yearly: ${results.carbonSaved?.toLocaleString()} tons
- Carbon Credit Revenue: ${this.formatInr(results.yearlyFarbonCreditRevenue)}/year

Provide a structured report with:
1. Executive Summary
2. Technical Feasibility
3. Market Opportunity
4. Financial Projections
5. Risk Analysis & Mitigation
6. Competitive Positioning
7. Timeline to Profitability
8. Investment Recommendation

Make it suitable for presenting to institutional investors.
    `;
  }

  buildRecommendationPrompt(inputs, results, regionalData, scraperData) {
    return `
Based on the latest market intelligence, provide an investment recommendation for this bagasse-to-GO venture.

PROJECT SCORECARD:
- ROI: ${results.roiPercent?.toFixed(1)}%
- Payback: ${results.paybackYears?.toFixed(1)} years
- Break-even GO price: ${this.formatInr(results.breakEvenGoPrice, 2)}/kg
- Yearly Profit: ${this.formatInr(results.yearlyProfit)}

REAL-TIME MARKET DATA:
${scraperData ? `
- Current GO Market Price Range: ${this.formatInr(scraperData.goPriceMin)}-${this.formatInr(scraperData.goPriceMax)}/kg
- Industry Electricity Rate Average: ${this.formatInr(scraperData.avgElectricityCost, 2)}/kWh
- Latest Carbon Credit Rate: ${this.formatInr(scraperData.carbonCreditRate)}/ton CO2
- Key Competitors: ${scraperData.competitors?.join(', ')}
- Recent Policy Changes: ${scraperData.recentPolicies?.join(', ')}
` : 'Market data pending...'}

REGION: ${inputs.selectedRegion}
Incentives Available: ${regionalData[inputs.selectedRegion]?.majorIncentives?.join(', ')}

Considering:
1. Current market conditions and trends
2. Government policy landscape in ${inputs.selectedRegion}
3. Competitive positioning
4. Risk factors (market, operational, policy)
5. Growth potential

Provide a clear RECOMMEND or CAUTION recommendation with:
- Investment Score (1-10)
- Key Success Factors
- Critical Risks
- Timeline Considerations
- Next Steps for Due Diligence

Be objective and realistic.
    `;
  }
}

export default new OpenRouterService();
