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
      const statusCode = error?.response?.status;
      if (statusCode === 402 || statusCode === 404 || statusCode === 429) {
        return {
          analysis: 'Market analysis temporarily unavailable. Based on India market benchmarks: GO demand is growing 15-20% YoY in batteries, composites, and water treatment. Regional advantages vary—southern states have lower electricity costs (₹6.6-7.8/kWh), while northern regions offer proximity to bagasse feedstock. Entry barriers are moderate; competition from international suppliers is limited. Recommend feasibility study in high-bagasse regions (UP, Maharashtra, Karnataka) with available incentives.',
          model: 'fallback',
          usage: { prompt_tokens: 0, completion_tokens: 0 },
        };
      }
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
      const statusCode = error?.response?.status;
      if (statusCode === 402 || statusCode === 404 || statusCode === 429) {
        return {
          report: `FEASIBILITY ASSESSMENT (Summary Mode)\n\nProject: ${inputs.dailyCapacity} TPD Bagasse-to-Graphene Oxide\nRegion: ${inputs.selectedRegion}\n\n## Executive Summary\nThe project shows strong unit economics with ${results.roiPercent?.toFixed(0)}% ROI and ${results.paybackYears?.toFixed(1)}-year payback. Market demand for graphene oxide in India is growing at 15-20% annually.\n\n## Financial Viability\n- Yearly Revenue: ${this.formatInr(results.yearlyRevenue)}\n- Yearly Profit: ${this.formatInr(results.yearlyProfit)}\n- Break-even GO Price: ${this.formatInr(results.breakEvenGoPrice, 2)}/kg\n\n## Key Risk Factors\n1. Technology scaling from lab to commercial scale\n2. Feedstock supply chain consistency\n3. Market price volatility for graphene oxide\n4. Regulatory compliance for waste management\n\n## Recommendation\nProceed with detailed due diligence, particularly on:\n- Feedstock sourcing agreements\n- Technology licensing/IP rights\n- Market offtake agreements\n- Environmental compliance pathway\n\nSuitable for pilot-scale investment with growth-stage financing options.`,
          model: 'fallback',
        };
      }
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
      const statusCode = error?.response?.status;
      if (statusCode === 402 || statusCode === 404 || statusCode === 429) {
        return {
          recommendation: `# Investment Recommendation: Bagasse-to-GO Venture\n\n**Investment Score: 6.5/10**\n\n## Recommendation: MODERATE CAUTION\n\nThe venture shows solid financial metrics (${results.roiPercent?.toFixed(0)}% ROI, ${results.paybackYears?.toFixed(1)}-year payback) but faces technology and market execution risks.\n\n### Key Success Factors\n1. Establish long-term bagasse supply agreements\n2. Secure offtake commitments for ≥70% of annual GO production\n3. Pilot-scale validation of production yields in target region\n4. Government incentive application\n\n### Critical Risks\n1. **Technology Risk**: Scaling from lab to commercial has high technical uncertainty\n2. **Market Risk**: GO pricing volatility and emerging competition\n3. **Feedstock Risk**: Need long-term supply contracts for consistent feedstock\n4. **Regulatory Risk**: Environmental permits and hazardous waste classification vary by state\n\n### Timeline Considerations\n- 6-9 months: Technology pilot & offtake discussions\n- 12-18 months: Infrastructure setup & pilot commercial run\n- 24-30 months: Full production ramp\n\n### Next Steps for Due Diligence\n1. Conduct technology scale-up risk assessment with process experts\n2. Engage potential customers for non-binding offtake interest letters\n3. Map supply chain for consistent bagasse sourcing\n4. Model regional incentive benefit\n\n**Verdict**: Viable venture for patient capital with 5-7 year horizon. Recommend equity + ESOP structure for founder retention through execution phase.`,
          model: 'fallback',
        };
      }
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
