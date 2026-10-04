export const exampleQuestions = [
  'Is electric vehicle adoption increasing worldwide?',
  'What are the effects of AI on software development?',
  'Is remote work more productive?',
  'What are the latest developments in renewable energy?',
]

export const stats = [
  { label: 'Research Sessions', value: '24', icon: 'search' },
  { label: 'Sources Analyzed', value: '186', icon: 'link' },
  { label: 'Claims Verified', value: '143', icon: 'check' },
  { label: 'Average Confidence', value: '91%', icon: 'gauge' },
]

export const recentResearch = [
  {
    id: 'ev-1',
    question: 'Is electric vehicle adoption increasing worldwide?',
    date: 'Mar 12, 2026',
    sources: 12,
    claimCount: 8,
    confidence: 91,
    status: 'Completed',
    processingTime: '2m 14s',
    summary:
      'Electric vehicle adoption has increased significantly across major markets. However, the rate of growth differs by region and measurement method.',
    claims: [
      {
        id: 'c1',
        claim: 'Global EV sales increased significantly in recent years.',
        verdict: 'supported',
        confidence: 94,
        explanation: 'Multiple major reports show double-digit growth in EV sales across global markets over the last several quarters.',
        sources: ['IEA Global EV Outlook 2025', 'BloombergNEF 2025'],
      },
      {
        id: 'c2',
        claim: 'Growth rates vary widely by region.',
        verdict: 'partially-supported',
        confidence: 78,
        explanation: 'Adoption is accelerating in China and Europe, while the pace remains uneven in North America and emerging markets.',
        sources: ['IEA', 'McKinsey Mobility Report'],
      },
      {
        id: 'c3',
        claim: 'EV adoption has plateaued in the last year.',
        verdict: 'contradicted',
        confidence: 86,
        explanation: 'The available evidence does not support a plateau and instead indicates continued year-over-year expansion in most markets.',
        sources: ['IEA', 'Reuters'],
      },
    ],
    sourcesData: [
      {
        id: 's1',
        title: 'World Energy Outlook 2025',
        domain: 'iea.org',
        snippet: 'Global EV adoption has continued to increase as manufacturing capacity and policy support expand across major markets.',
        relevance: 94,
        credibility: 'High',
        url: 'https://www.iea.org/reports/world-energy-outlook-2025',
      },
      {
        id: 's2',
        title: 'Electric Vehicle Outlook 2025',
        domain: 'about.bnef.com',
        snippet: 'Sales growth remains strong, though regional dynamics differ materially between China, Europe, and North America.',
        relevance: 90,
        credibility: 'High',
        url: 'https://about.bnef.com/insights/transport/electric-vehicle-outlook/',
      },
      {
        id: 's3',
        title: 'Reuters EV Market Update',
        domain: 'reuters.com',
        snippet: 'Policy support and lower battery costs are continuing to push adoption higher, even as growth slows in some markets.',
        relevance: 86,
        credibility: 'Medium',
        url: 'https://www.reuters.com/world/',
      },
    ],
    contradictions: [
      {
        id: 'conf1',
        sourceA: 'IEA',
        claimA: 'EV sales increased by 30%.',
        sourceB: 'Reuters',
        claimB: 'EV sales increased by 20%.',
        analysis: 'The sources use different regions and time periods, which explains the discrepancy in the reported growth rate.',
      },
    ],
  },
  {
    id: 'ai-2',
    question: 'What are the effects of AI on software development?',
    date: 'Feb 28, 2026',
    sources: 9,
    claimCount: 6,
    confidence: 88,
    status: 'Completed',
    processingTime: '1m 40s',
    summary: 'AI tools are increasing developer productivity and automating repetitive coding tasks, but they are not replacing judgment and testing workflows entirely.',
    claims: [
      {
        id: 'c4',
        claim: 'AI coding tools increase productivity for routine development tasks.',
        verdict: 'supported',
        confidence: 92,
        explanation: 'Research across productivity studies and industry surveys points to meaningful gains for boilerplate generation and code review assistance.',
        sources: ['GitHub Octoverse', 'McKinsey'],
      },
    ],
    sourcesData: [],
    contradictions: [],
  },
  {
    id: 'remote-3',
    question: 'Is remote work more productive?',
    date: 'Jan 19, 2026',
    sources: 7,
    claimCount: 5,
    confidence: 74,
    status: 'Partially Supported',
    processingTime: '1m 12s',
    summary: 'Evidence suggests remote work improves focus and flexibility for many roles, but outcomes depend heavily on team design and managerial practices.',
    claims: [],
    sourcesData: [],
    contradictions: [],
  },
]

export const historyEntries = [
  { id: 'ev-1', question: 'Is electric vehicle adoption increasing worldwide?', date: 'Mar 12, 2026', status: 'Completed', sources: 12, claims: 8, confidence: 91 },
  { id: 'ai-2', question: 'What are the effects of AI on software development?', date: 'Feb 28, 2026', status: 'Completed', sources: 9, claims: 6, confidence: 88 },
  { id: 'remote-3', question: 'Is remote work more productive?', date: 'Jan 19, 2026', status: 'Partially Supported', sources: 7, claims: 5, confidence: 74 },
  { id: 'renew-4', question: 'What are the latest developments in renewable energy?', date: 'Dec 23, 2025', status: 'Researching', sources: 4, claims: 2, confidence: 63 },
]

export const savedReports = [
  {
    id: 'ev-1',
    question: 'Is electric vehicle adoption increasing worldwide?',
    date: 'Mar 12, 2026',
    summary: 'EV adoption remains strong globally, with uneven regional growth and potential policy-driven acceleration.',
    confidence: 91,
    sources: 12,
  },
  {
    id: 'ai-2',
    question: 'What are the effects of AI on software development?',
    date: 'Feb 28, 2026',
    summary: 'AI tools improve coding speed and developer experience, but human oversight remains essential for quality and trust.',
    confidence: 88,
    sources: 9,
  },
]
