export const AMBIGUOUS_TERMS = {
  VAGUE_PERFORMANCE: {
    terms: ['fast', 'quick', 'rapid', 'speedy', 'efficient', 'optimized'],
    clarification: "I noticed you mentioned '{term}'. To ensure clear requirements, could you specify exact metrics? For example:\n- Page load time: under X seconds\n- API response time: under X milliseconds\n- Search results: displayed within X seconds\n- Database query: completed in under X seconds"
  },

  VAGUE_SECURITY: {
    terms: ['secure', 'safe', 'protected', 'encrypted'],
    clarification: "You mentioned '{term}'. Let's be specific about security requirements:\n- What data needs encryption? (at rest, in transit, or both)\n- What authentication method? (OAuth, JWT, basic auth, multi-factor)\n- Any compliance standards? (GDPR, HIPAA, PCI-DSS, SOC 2)\n- Password requirements? (length, complexity, expiration)\n- Session management needs?"
  },

  VAGUE_USABILITY: {
    terms: ['user-friendly', 'intuitive', 'easy to use', 'simple', 'straightforward'],
    clarification: "'{term}' means different things to different people. Let's define this more clearly:\n- Should users be able to complete [main task] without training?\n- Maximum number of clicks to reach key features?\n- Should there be tooltips, tutorials, or help documentation?\n- Any specific accessibility requirements (WCAG compliance)?\n- What's the technical proficiency of your target users?"
  },

  VAGUE_SCALABILITY: {
    terms: ['scalable', 'handle growth', 'support more users'],
    clarification: "Let's quantify 'scalability':\n- Current expected users: X\n- Expected users in 1 year: X\n- Expected users in 3 years: X\n- Peak concurrent users: X\n- Data growth rate: X GB/month\n- Transaction volume: X per day/hour"
  },

  VAGUE_COMPATIBILITY: {
    terms: ['compatible', 'work on all devices', 'cross-platform'],
    clarification: "Let's specify compatibility requirements:\n- Operating systems: Windows (versions?), macOS (versions?), Linux (distros?)?\n- Browsers: Chrome, Firefox, Safari, Edge (minimum versions?)?\n- Mobile: iOS (version?), Android (version?), both?\n- Screen sizes: minimum resolution?\n- Accessibility: screen readers, keyboard navigation?"
  },

  VAGUE_RELIABILITY: {
    terms: ['reliable', 'stable', 'always available', "won't crash"],
    clarification: "Let's define reliability metrics:\n- Required uptime: 99%? 99.9%? 99.99%?\n- Acceptable downtime for maintenance: X hours per month?\n- Maximum acceptable response time: X seconds?\n- Data backup frequency: hourly, daily, weekly?\n- Disaster recovery time objective (RTO): X hours?"
  },

  VAGUE_QUANTITY: {
    terms: ['many', 'few', 'some', 'several', 'multiple', 'lots of'],
    clarification: "'{term}' is ambiguous. Could you provide specific numbers?\n- Exactly how many?\n- Minimum and maximum expected?\n- Average case scenario?"
  },

  VAGUE_FREQUENCY: {
    terms: ['frequently', 'occasionally', 'rarely', 'sometimes', 'often'],
    clarification: "Instead of '{term}', could you specify:\n- How many times per day/week/month?\n- Peak usage times?\n- Expected transaction volume?"
  }
};

export const MISSING_INFO_PATTERNS = {
  USER_MENTIONED_WITHOUT_ACTIONS: {
    pattern: /\b(user|admin|customer|manager)\b/i,
    follow_up: "You mentioned {role}. What specific actions should {role} be able to perform in the system? What are their main goals?"
  },

  FEATURE_WITHOUT_DETAILS: {
    pattern: /\b(feature|functionality|capability|module)\b/i,
    follow_up: "Could you elaborate on this feature? What's the detailed workflow? What are the inputs and expected outputs?"
  },

  DATA_WITHOUT_STRUCTURE: {
    pattern: /\b(store|save|data|information|records)\b/i,
    follow_up: "What specific data fields need to be stored? What's the data structure? Are there relationships between different data entities?"
  },

  INTEGRATION_WITHOUT_DETAILS: {
    pattern: /\b(integrate|connect|link|sync)\b/i,
    follow_up: "For this integration, what data needs to be exchanged? In what format? How often? Are there any authentication requirements?"
  },

  PAYMENT_WITHOUT_DETAILS: {
    pattern: /\b(payment|pay|checkout|transaction)\b/i,
    follow_up: "For payment processing:\n- Which payment methods? (credit card, PayPal, Stripe, etc.)\n- Currency support?\n- Refund handling?\n- Payment security/compliance needs (PCI-DSS)?"
  }
};
