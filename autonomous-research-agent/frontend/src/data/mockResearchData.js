export const INITIAL_RESEARCH_DATA = [
  {
    research_id: 'res-exercise-cognition',
    question: 'Does regular exercise improve cognitive performance?',
    verdict: 'SUPPORTED',
    confidence: 87,
    status: 'completed',
    created_at: '2026-10-04T09:30:00Z',
    completed_at: '2026-10-04T09:30:14Z',
    source_count: 10,
    claim_count: 4,
    supporting_count: 8,
    conflicting_count: 2,
    independent_count: 6,
    evidence_strength: 87,
    source_agreement: 82,
    research_coverage: 91,
    conflict_level: 'Low',
    summary:
      'The available evidence generally supports this claim, although the strength of evidence varies across studies. Aerobic and resistance training demonstrably upregulate BDNF (brain-derived neurotrophic factor), promote neuroplasticity, enhance hippocampal perfusion, and boost executive functions including memory retention, attentional focus, and processing speed.',
    verdict_description:
      'The available evidence generally supports this claim, although the strength of evidence varies across studies. Clinical trials and meta-analyses show reproducible improvements in memory and processing speed.',
    claims: [
      {
        claim: 'Aerobic exercise increases serum brain-derived neurotrophic factor (BDNF) levels.',
        verdict: 'Supported',
        confidence: 0.92,
        explanation:
          'Multiple randomized controlled trials and prospective cohorts demonstrate that moderate-to-vigorous aerobic exercise triggers acute and sustained BDNF release, supporting synaptic plasticity.',
        supporting_sources: [
          'https://www.nature.com/articles/nrn2298',
          'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4915811/',
        ],
      },
      {
        claim: 'Regular cardiovascular physical activity improves memory retention and hippocampal volume in aging adults.',
        verdict: 'Supported',
        confidence: 0.88,
        explanation:
          'MRI neuroimaging trials over 12-month periods show a 2% volume increase in the anterior hippocampus among aerobically active older adults versus controls.',
        supporting_sources: [
          'https://www.pnas.org/doi/10.1073/pnas.1015950108',
          'https://www.health.harvard.edu/mind-and-mood/exercise-can-boost-your-memory-and-thinking-skills',
        ],
      },
      {
        claim: 'Executive function benefits are observed across all age demographics without threshold requirements.',
        verdict: 'Partially Supported',
        confidence: 0.76,
        explanation:
          'While benefits occur broadly, acute bouts under 20 minutes showed mixed or negligible statistical significance in young adults with high baseline athletic conditioning.',
        supporting_sources: [
          'https://www.frontiersin.org/articles/10.3389/fnagi.2018.00398',
        ],
      },
      {
        claim: 'Acute physical exhaustion immediately preceding testing consistently improves working memory.',
        verdict: 'Contradicted',
        confidence: 0.84,
        explanation:
          'Several high-intensity anaerobic studies found transient decrements in working memory immediately post-exhaustion due to metabolic fatigue and transient prefrontal hypofrontality.',
        supporting_sources: [
          'https://www.sciencedirect.com/science/article/pii/S105381191500350X',
        ],
      },
    ],
    contradictions: [
      'Two physiological studies note that severe acute physical exhaustion temporarily impairs working memory immediately post-session before recovery occurs.',
      'A minority cohort study of elite athletes noted no significant marginal cognitive gains compared to non-exercising controls on computerized spatial reasoning tasks.',
    ],
    sources: [
      {
        title: 'Exercise training increases size of hippocampus and improves memory',
        url: 'https://www.pnas.org/doi/10.1073/pnas.1015950108',
        source_name: 'pnas.org',
        published_date: '2024-02-15',
        snippet:
          'Aerobic exercise training increases hippocampal perfusion and grey matter volume by approximately 2%, effectively reversing age-related loss in healthy older adults.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.96,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Physical exercise as a modulator of brain plasticity and cognitive function',
        url: 'https://www.nature.com/articles/nrn2298',
        source_name: 'nature.com',
        published_date: '2024-01-20',
        snippet:
          'Physical activity enhances cellular mechanisms associated with learning and neurogenesis. BDNF and IGF-1 gene expressions are consistently elevated following aerobic conditioning regimens.',
        source_type: 'Research Paper',
        credibility_score: 'High',
        relevance_score: 0.94,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Exercise Can Boost Your Memory and Thinking Skills',
        url: 'https://www.health.harvard.edu/mind-and-mood/exercise-can-boost-your-memory-and-thinking-skills',
        source_name: 'health.harvard.edu',
        published_date: '2024-03-10',
        snippet:
          'Regular physical activity has been associated with improvements in several measures of cognitive function, specifically executive task-switching, selective attention, and spatial memory.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.92,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Physical Activity Guidelines for Cognitive Health and Dementia Risk Reduction',
        url: 'https://www.cdc.gov/physicalactivity/basics/adults/health-benefits-of-physical-activity.html',
        source_name: 'cdc.gov',
        published_date: '2023-11-18',
        snippet:
          'Public health guidelines emphasize that 150 minutes of moderate aerobic activity weekly significantly lowers cognitive decline risks and preserves daily cognitive independence.',
        source_type: 'Government',
        credibility_score: 'High',
        relevance_score: 0.89,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Systematic Review of Exercise Interventions on Executive Function',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4915811/',
        source_name: 'ncbi.nlm.nih.gov',
        published_date: '2023-09-05',
        snippet:
          'Across 36 controlled clinical trials, moderate aerobic interventions showed an effect size of g = 0.38 for inhibitory control and g = 0.42 for working memory.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.88,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Neurological impact of transient high-intensity fatigue on prefrontal cortex activity',
        url: 'https://www.sciencedirect.com/science/article/pii/S105381191500350X',
        source_name: 'sciencedirect.com',
        published_date: '2023-07-22',
        snippet:
          'Some sources provide evidence that does not fully align with the overall conclusion. Immediate post-exhaustion testing revealed temporary decrements in executive recall due to competing metabolic resources.',
        source_type: 'Research Paper',
        credibility_score: 'High',
        relevance_score: 0.85,
        supports_claim: false,
        evidence_strength: 'Moderate',
        conflict_explanation:
          'Demonstrates transient cognitive drops immediately following near-maximal anaerobic strain before homeostasis is reestablished.',
      },
      {
        title: 'Cognitive testing across elite vs sedentary student cohorts',
        url: 'https://www.frontiersin.org/articles/10.3389/fnagi.2018.00398',
        source_name: 'frontiersin.org',
        published_date: '2023-04-12',
        snippet:
          'Baseline cognitive assessments failed to show statistically significant differences in pure logic puzzles among already active young adults without specific cognitive training.',
        source_type: 'Academic',
        credibility_score: 'Medium',
        relevance_score: 0.78,
        supports_claim: false,
        evidence_strength: 'Moderate',
        conflict_explanation:
          'Highlights ceiling effects and lack of measurable delta in young cohorts already at high fitness baselines.',
      },
      {
        title: 'Global Trends in Preventive Cognitive Healthcare and Fitness',
        url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
        source_name: 'who.int',
        published_date: '2023-12-01',
        snippet:
          'Regular physical activity improves general mental well-being, mood regulation, and neurovascular health across diverse global demographic groups.',
        source_type: 'Government',
        credibility_score: 'High',
        relevance_score: 0.84,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
    ],
    report: `# Verification Report: Exercise & Cognitive Performance

## Executive Summary
Multiple systematic reviews, neuroimaging assessments, and prospective controlled trials demonstrate robust empirical support for the hypothesis that regular physical exercise improves cognitive function. The biological mechanisms include elevated expression of brain-derived neurotrophic factor (BDNF), increased hippocampal volume, and superior cerebral vascularization.

## Core Findings & Alignment
1. **Structural Plasticity**: Aerobic training produces measurable increases in hippocampal volume in older adults (+2% over 12 months in randomized trials).
2. **Biomarker Synthesis**: Serum BDNF and vascular endothelial growth factor (VEGF) consistently increase post-exercise.
3. **Executive Function**: Significant positive effect sizes are documented for working memory, inhibitory control, and attentional focus.

## Nuances and Observed Conflicts
While chronic aerobic and resistance training yield unequivocal cognitive benefits, two key caveats emerge:
- Immediate testing upon physical exhaustion can show transient prefrontal hypoperfusion and mild temporary task decline.
- Young adults already at elite aerobic baselines exhibit ceiling effects on standard computerized cognitive assays.`,
    metadata: {
      search_count: 14,
      source_count: 10,
      processing_time: 3.42,
    },
  },
  {
    research_id: 'res-fasting-lifespan',
    question: 'Does intermittent fasting extend human lifespan?',
    verdict: 'MIXED EVIDENCE',
    confidence: 64,
    status: 'completed',
    created_at: '2026-10-03T16:15:00Z',
    completed_at: '2026-10-03T16:15:18Z',
    source_count: 8,
    claim_count: 3,
    supporting_count: 4,
    conflicting_count: 4,
    independent_count: 5,
    evidence_strength: 64,
    source_agreement: 58,
    research_coverage: 85,
    conflict_level: 'High',
    summary:
      'Intermittent fasting consistently extends lifespan and improves metabolic biomarkers in rodent and non-human primate models. However, long-term randomized clinical trials confirming an increase in human longevity do not yet exist, and current observational human data remains correlational.',
    verdict_description:
      'Compelling animal studies and short-term metabolic biomarkers exist, but direct empirical proof of increased maximum human lifespan is currently lacking.',
    claims: [
      {
        claim: 'Intermittent fasting upregulates autophagy and cellular repair markers in human trials.',
        verdict: 'Supported',
        confidence: 0.81,
        explanation:
          'Controlled fasting intervals of 16+ hours stimulate AMPK activation, sirtuin expression, and cellular autophagic clearance in clinical biopsies.',
        supporting_sources: ['https://www.nejm.org/doi/full/10.1056/NEJMra1905136'],
      },
      {
        claim: 'Intermittent fasting conclusively increases all-cause human longevity compared to isocaloric standard diets.',
        verdict: 'Contradicted',
        confidence: 0.72,
        explanation:
          'Long-term human epidemiological data shows that when total caloric intake and protein are matched, fasting protocols do not yield statistically superior lifespan extension over general balanced nutrition.',
        supporting_sources: ['https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2771095'],
      },
    ],
    contradictions: [
      'A 2024 AHA cardiovascular epidemiological analysis raised concerns regarding time-restricted feeding windows under 8 hours with potential adverse vascular outcomes.',
      'Clinical calorie-matched trials demonstrate benefits stem from calorie deficits rather than meal timing alone.',
    ],
    sources: [
      {
        title: 'Effects of Intermittent Fasting on Health, Aging, and Disease',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMra1905136',
        source_name: 'nih.gov',
        published_date: '2023-10-14',
        snippet: 'Cellular adaptation during fasting includes enhanced mitochondrial health, DNA repair, and autophagy.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.95,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
      {
        title: 'Effects of Time-Restricted Eating on Weight Loss and Metabolic Health in Humans',
        url: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2771095',
        source_name: 'jamanetwork.com',
        published_date: '2023-08-19',
        snippet: 'Time-restricted eating did not confer weight loss or cardiometabolic benefits beyond standard consistent meal timing.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.91,
        supports_claim: false,
        evidence_strength: 'Strong',
        conflict_explanation: 'Contradicts claim that timing alone extends metabolic superiority over matched controls.',
      },
    ],
    report: `# Verification Report: Intermittent Fasting & Human Lifespan

## Consensus Overview
Preclinical animal models demonstrate lifespan extension of up to 20-30% via caloric restriction and intermittent feeding schedules. However, translation to humans is strictly limited to surrogate metabolic markers (HbA1c, insulin sensitivity, blood pressure). Long-term clinical survival trials remain unfeasible.`,
    metadata: {
      search_count: 11,
      source_count: 8,
      processing_time: 2.89,
    },
  },
  {
    research_id: 'res-remote-work-productivity',
    question: 'Does remote work improve overall employee productivity?',
    verdict: 'SUPPORTED',
    confidence: 84,
    status: 'completed',
    created_at: '2026-10-02T11:20:00Z',
    completed_at: '2026-10-02T11:20:12Z',
    source_count: 12,
    claim_count: 4,
    supporting_count: 9,
    conflicting_count: 3,
    independent_count: 7,
    evidence_strength: 84,
    source_agreement: 79,
    research_coverage: 92,
    conflict_level: 'Low',
    summary:
      'Aggregated research from Stanford, Harvard Business Review, and Bureau of Labor Statistics indicates that hybrid and remote workers demonstrate a 4% to 13% net increase in self-reported and measured output, predominantly driven by reduced commuting fatigue and fewer office distractions.',
    verdict_description:
      'Broad empirical research verifies higher individual focus output in knowledge work, though collaborative brainstorm tasks and mentorship experience slight headwinds.',
    claims: [
      {
        claim: 'Elimination of commutes leads to direct reinvestment of hours into productive output.',
        verdict: 'Supported',
        confidence: 0.89,
        explanation: 'Time-use surveys confirm approximately 35% of saved commute time is directly applied toward work activities.',
        supporting_sources: ['https://wfhresearch.com/'],
      },
    ],
    contradictions: [
      'Certain junior mentorship and junior developer onboarding metrics decreased during fully remote environments without structured pairing.',
    ],
    sources: [
      {
        title: 'Working from Home and Productivity: Global Evidence',
        url: 'https://wfhresearch.com/data/',
        source_name: 'wfhresearch.com',
        published_date: '2024-02-01',
        snippet: 'Comprehensive survey across 27 countries establishes a persistent 3-5% productivity boost in hybrid setups.',
        source_type: 'Academic',
        credibility_score: 'High',
        relevance_score: 0.94,
        supports_claim: true,
        evidence_strength: 'Strong',
      },
    ],
    report: `# Verification Report: Remote Work & Productivity

## Key Findings
Evidence strongly supports that focused knowledge work benefits from remote environments. Hybrid structures (2-3 days remote) demonstrate the highest overall worker satisfaction and team retention metrics.`,
    metadata: {
      search_count: 16,
      source_count: 12,
      processing_time: 3.1,
    },
  },
  {
    research_id: 'res-5g-health-effects',
    question: 'Do 5G cellular frequencies transmit biological pathogens or suppress immunity?',
    verdict: 'FALSE',
    confidence: 94,
    status: 'completed',
    created_at: '2026-09-29T14:15:00Z',
    completed_at: '2026-09-29T14:15:10Z',
    source_count: 14,
    claim_count: 3,
    supporting_count: 0,
    conflicting_count: 12,
    independent_count: 8,
    evidence_strength: 94,
    source_agreement: 96,
    research_coverage: 95,
    conflict_level: 'Very Low',
    summary:
      'Rigorous empirical testing, peer-reviewed epidemiology, and physical principles demonstrate that non-ionizing radiofrequency radiation from 5G cellular equipment cannot generate biological pathogens or impair systemic immune cell function.',
    verdict_description:
      'Directly contradicted by overwhelming empirical evidence, physical electromagnetic principles, and official health organization analyses.',
    claims: [
      {
        claim: 'Non-ionizing millimeter radio waves have sufficient photon energy to induce cellular damage.',
        verdict: 'Contradicted',
        confidence: 0.98,
        explanation: 'Photon energy in the gigahertz spectrum is thousands of times lower than the threshold required for molecular ionization.',
        supporting_sources: ['https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks-and-health'],
      },
    ],
    contradictions: [
      'Extensive international dosimetry studies confirm thermal exposure limits are respected by wide safety margins.',
    ],
    sources: [
      {
        title: '5G Mobile Networks and Health Considerations',
        url: 'https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks-and-health',
        source_name: 'who.int',
        published_date: '2024-01-15',
        snippet: 'To date, and after much research performed, no adverse health effect has been causally linked with exposure to wireless technologies.',
        source_type: 'Government',
        credibility_score: 'High',
        relevance_score: 0.87,
        supports_claim: false,
        evidence_strength: 'Strong',
      },
    ],
    report: `# Verification Report: 5G & Pathogen Transmission
## Core Finding
Extensive physical, medical, and biological evaluations confirm that RF emissions at regulatory compliance thresholds produce zero pathogenic material and exert no immunosuppressive effect.`,
    metadata: {
      search_count: 18,
      source_count: 14,
      processing_time: 2.75,
    },
  },
]

