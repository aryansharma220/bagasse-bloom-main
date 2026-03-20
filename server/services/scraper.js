import axios from 'axios';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class ScraperService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = this.getCacheTtlMinutes() * 60 * 1000;
  }

  getApiKey() {
    return process.env.OPENROUTER_API_KEY;
  }

  getMarketModel() {
    return process.env.OPENROUTER_MARKET_MODEL || 'perplexity/sonar';
  }

  getCacheTtlMinutes() {
    return Number(process.env.MARKET_CACHE_TTL_MINUTES || '20');
  }

  async getLiveMarketIntelligence(forceRefresh = false) {
    const cacheKey = 'live-market-intelligence';
    if (!forceRefresh && this.isCached(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required for real-time market data');
    }

    const prompt = `You are a market intelligence agent. Return ONLY valid JSON with no markdown.
Task: provide best-available latest market snapshot for India bagasse-to-graphene-oxide business.
Use current publicly available context and include uncertainty where needed.

Required JSON shape:
{
  "generatedAt": "ISO datetime",
  "grapheneOxide": {
    "priceUsdPerKg": { "min": number, "max": number, "avg": number },
    "notableSuppliers": ["string"],
    "recentSignals": ["string"]
  },
  "electricityIndiaIndustrialInrPerKwh": {
    "TamilNadu": number,
    "Karnataka": number,
    "Maharashtra": number,
    "UttarPradesh": number,
    "Gujarat": number,
    "Rajasthan": number,
    "AndhraPradesh": number,
    "Punjab": number
  },
  "carbonCredits": {
    "usdPerTonCo2": { "min": number, "max": number, "avg": number },
    "inrPerTonCo2": { "min": number, "max": number, "avg": number },
    "marketNotes": ["string"]
  },
  "bagasseIndia": {
    "availabilityMillionTonsPerYear": number,
    "pricingInrPerTon": { "min": number, "max": number, "avg": number },
    "majorSupplyRegions": ["string"]
  },
  "incentives": {
    "central": ["string"],
    "state": ["string"]
  },
  "marketNews": [
    {
      "title": "string",
      "source": "string",
      "date": "ISO date",
      "relevance": "high|medium|low"
    }
  ],
  "sources": ["string"],
  "confidence": number
}`;

    const response = await axios.post(
      OPENROUTER_BASE_URL,
      {
        model: this.getMarketModel(),
        temperature: 0.1,
        max_tokens: 1800,
        messages: [
          {
            role: 'system',
            content: 'Return strict JSON only. Do not wrap with markdown fences.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter returned empty market intelligence payload');
    }

    const parsed = this.parseJson(content);
    const normalized = this.normalizeIntelligence(parsed, response?.data?.model);
    this.setCached(cacheKey, normalized);
    return normalized;
  }

  /**
   * Get current GO market prices from AI-generated real-time intelligence.
   */
  async getGrapheneOxideMarketData() {
    const intelligence = await this.getLiveMarketIntelligence();
    return {
      goPriceMin: intelligence.grapheneOxide.priceUsdPerKg.min,
      goPriceMax: intelligence.grapheneOxide.priceUsdPerKg.max,
      goPriceAvg: intelligence.grapheneOxide.priceUsdPerKg.avg,
      suppliers: intelligence.grapheneOxide.notableSuppliers,
      signals: intelligence.grapheneOxide.recentSignals,
      source: 'openrouter-live-intelligence',
      confidence: intelligence.confidence,
      timestamp: intelligence.generatedAt,
      sources: intelligence.sources,
    };
  }

  /**
   * Get regional electricity cost data
   */
  async getRegionalElectricityCosts() {
    const intelligence = await this.getLiveMarketIntelligence();
    return {
      ...intelligence.electricityIndiaIndustrialInrPerKwh,
      timestamp: intelligence.generatedAt,
      source: 'openrouter-live-intelligence',
      confidence: intelligence.confidence,
      sources: intelligence.sources,
    };
  }

  /**
   * Get government incentive updates
   */
  async getGovernmentIncentives() {
    const intelligence = await this.getLiveMarketIntelligence();
    return {
      centralSchemes: intelligence.incentives.central,
      stateSchemes: intelligence.incentives.state,
      timestamp: intelligence.generatedAt,
      source: 'openrouter-live-intelligence',
      confidence: intelligence.confidence,
      sources: intelligence.sources,
    };
  }

  /**
   * Get carbon credit market rates
   */
  async getCarbonCreditRates() {
    const intelligence = await this.getLiveMarketIntelligence();
    return {
      indiaRegional: {
        min: intelligence.carbonCredits.usdPerTonCo2.min,
        max: intelligence.carbonCredits.usdPerTonCo2.max,
        average: intelligence.carbonCredits.usdPerTonCo2.avg,
        currency: 'USD',
      },
      inr: {
        min: intelligence.carbonCredits.inrPerTonCo2.min,
        max: intelligence.carbonCredits.inrPerTonCo2.max,
        average: intelligence.carbonCredits.inrPerTonCo2.avg,
        currency: 'INR',
      },
      notes: intelligence.carbonCredits.marketNotes,
      source: 'openrouter-live-intelligence',
      confidence: intelligence.confidence,
      updateDate: intelligence.generatedAt,
      sources: intelligence.sources,
    };
  }

  /**
   * Get bagasse market data
   */
  async getBagasseMarketData() {
    const intelligence = await this.getLiveMarketIntelligence();
    return {
      totalAvailability: {
        indiaMillionTonsPerYear: intelligence.bagasseIndia.availabilityMillionTonsPerYear,
      },
      pricing: {
        minInrPerTon: intelligence.bagasseIndia.pricingInrPerTon.min,
        maxInrPerTon: intelligence.bagasseIndia.pricingInrPerTon.max,
        avgInrPerTon: intelligence.bagasseIndia.pricingInrPerTon.avg,
      },
      majorSupplyRegions: intelligence.bagasseIndia.majorSupplyRegions,
      source: 'openrouter-live-intelligence',
      confidence: intelligence.confidence,
      timestamp: intelligence.generatedAt,
      sources: intelligence.sources,
    };
  }

  /**
   * Search for recent policy/market news
   */
  async getRecentMarketNews() {
    const intelligence = await this.getLiveMarketIntelligence();
    return intelligence.marketNews;
  }

  parseJson(content) {
    const stripped = content.trim();
    if (stripped.startsWith('{') && stripped.endsWith('}')) {
      return JSON.parse(stripped);
    }

    const fencedMatch = stripped.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fencedMatch?.[1]) {
      return JSON.parse(fencedMatch[1]);
    }

    const firstBrace = stripped.indexOf('{');
    const lastBrace = stripped.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
    }

    throw new Error('Unable to parse JSON from OpenRouter market intelligence response');
  }

  normalizeIntelligence(raw, modelName) {
    return {
      generatedAt: raw.generatedAt || new Date().toISOString(),
      grapheneOxide: {
        priceUsdPerKg: {
          min: Number(raw?.grapheneOxide?.priceUsdPerKg?.min),
          max: Number(raw?.grapheneOxide?.priceUsdPerKg?.max),
          avg: Number(raw?.grapheneOxide?.priceUsdPerKg?.avg),
        },
        notableSuppliers: Array.isArray(raw?.grapheneOxide?.notableSuppliers)
          ? raw.grapheneOxide.notableSuppliers
          : [],
        recentSignals: Array.isArray(raw?.grapheneOxide?.recentSignals)
          ? raw.grapheneOxide.recentSignals
          : [],
      },
      electricityIndiaIndustrialInrPerKwh: {
        TamilNadu: Number(raw?.electricityIndiaIndustrialInrPerKwh?.TamilNadu),
        Karnataka: Number(raw?.electricityIndiaIndustrialInrPerKwh?.Karnataka),
        Maharashtra: Number(raw?.electricityIndiaIndustrialInrPerKwh?.Maharashtra),
        UttarPradesh: Number(raw?.electricityIndiaIndustrialInrPerKwh?.UttarPradesh),
        Gujarat: Number(raw?.electricityIndiaIndustrialInrPerKwh?.Gujarat),
        Rajasthan: Number(raw?.electricityIndiaIndustrialInrPerKwh?.Rajasthan),
        AndhraPradesh: Number(raw?.electricityIndiaIndustrialInrPerKwh?.AndhraPradesh),
        Punjab: Number(raw?.electricityIndiaIndustrialInrPerKwh?.Punjab),
      },
      carbonCredits: {
        usdPerTonCo2: {
          min: Number(raw?.carbonCredits?.usdPerTonCo2?.min),
          max: Number(raw?.carbonCredits?.usdPerTonCo2?.max),
          avg: Number(raw?.carbonCredits?.usdPerTonCo2?.avg),
        },
        inrPerTonCo2: {
          min: Number(raw?.carbonCredits?.inrPerTonCo2?.min),
          max: Number(raw?.carbonCredits?.inrPerTonCo2?.max),
          avg: Number(raw?.carbonCredits?.inrPerTonCo2?.avg),
        },
        marketNotes: Array.isArray(raw?.carbonCredits?.marketNotes)
          ? raw.carbonCredits.marketNotes
          : [],
      },
      bagasseIndia: {
        availabilityMillionTonsPerYear: Number(raw?.bagasseIndia?.availabilityMillionTonsPerYear),
        pricingInrPerTon: {
          min: Number(raw?.bagasseIndia?.pricingInrPerTon?.min),
          max: Number(raw?.bagasseIndia?.pricingInrPerTon?.max),
          avg: Number(raw?.bagasseIndia?.pricingInrPerTon?.avg),
        },
        majorSupplyRegions: Array.isArray(raw?.bagasseIndia?.majorSupplyRegions)
          ? raw.bagasseIndia.majorSupplyRegions
          : [],
      },
      incentives: {
        central: Array.isArray(raw?.incentives?.central) ? raw.incentives.central : [],
        state: Array.isArray(raw?.incentives?.state) ? raw.incentives.state : [],
      },
      marketNews: Array.isArray(raw?.marketNews) ? raw.marketNews : [],
      sources: Array.isArray(raw?.sources) ? raw.sources : [],
      confidence: Number(raw?.confidence || 0),
      model: modelName || OPENROUTER_MARKET_MODEL,
    };
  }

  isCached(key) {
    if (!this.cache.has(key)) return false;
    const { timestamp } = this.cache.get(key);
    return Date.now() - timestamp < this.cacheTimeout;
  }

  setCached(key, data) {
    this.cache.set(key, { ...data, timestamp: Date.now() });
  }
}

export default new ScraperService();
