import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'ai-adoption-by-function-health-tech'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — Title / Operating Thesis
  // ==========================================
  {
    id: 'title',
    title: 'AI Adoption by Function in Health Tech',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Framework',
      headline: 'AI Adoption by Function in Health Tech',
      subtitle: 'A practical framework for making function-level AI operating decisions.\n\nAI rollout should not be managed as one enterprise program. It should be managed as a series of function-level operating decisions under one common management system.\n\nThe goal is not broad AI activity. The goal is measurable improvement in how each function performs, with clear ownership, appropriate controls, and deliberate changes to workflow, organizational design, staffing, and investment.',
      insightBox: {
        label: 'Bottom Line',
        text: 'Do not ask, "Where can we use AI?" Ask, "What has to change in each function for AI to improve performance without breaking control?"',
      },
    },
  },

  // ==========================================
  // Slide 2 — Purpose of This Document
  // ==========================================
  {
    id: 'purpose',
    title: 'Purpose of This Document',
    type: 'list',
    content: {
      type: 'list',
      heading: 'Purpose of This Document',
      description: 'This document provides a structured framework for evaluating AI adoption across operating functions in a health tech company. It is designed to support management teams working through AI decisions at the function level — not as a single enterprise program, but as a series of operating choices that each require clarity on value, workflow change, governance, tooling, organizational design, staffing, and investment.',
      groups: [
        {
          title: 'Use this when',
          icon: getIcon('check'),
          items: [
            { text: 'A portfolio company is moving beyond early AI experimentation and needs to make function-level operating decisions' },
            { text: 'Management needs a common structure for evaluating AI readiness and impact across different functions' },
            { text: 'A board or investment committee wants to assess whether AI adoption is being managed with appropriate rigor' },
            { text: 'Functional leaders need a shared language for surfacing what actually has to change' },
          ],
        },
        {
          title: 'This is not',
          icon: getIcon('cross'),
          items: [
            { text: 'A technology strategy, a vendor recommendation, or an implementation roadmap. Those follow from the decisions this framework is designed to force.' },
          ],
        },
      ],
    },
  },

  // ==========================================
  // Slide 3 — Market Context
  // ==========================================
  {
    id: 'market-context',
    title: 'Market Context',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'Market Context Informing This Framework',
      description: 'Four observations from current enterprise evidence shaped the design of this framework:',
      levels: [
        {
          level: 1,
          title: 'Most companies are using AI but few are scaling it operationally',
          description: 'McKinsey\'s 2025 global survey found broad AI adoption but limited evidence of scaled operating impact outside a few functions. The biggest differentiator in value capture is workflow redesign, not breadth of experimentation.',
        },
        {
          level: 2,
          title: 'Most enterprise AI is bought, not built',
          description: 'Menlo Ventures reported that 76% of enterprise AI use cases are now addressed with purchased or embedded tools rather than internally developed models.',
        },
        {
          level: 3,
          title: 'Focused portfolios outperform broad experimentation',
          description: 'Johnson & Johnson pursued nearly 900 AI use cases before concluding that only 10–15% drove most of the value, leading to a shift toward a more focused, function-owned model.',
        },
        {
          level: 4,
          title: 'The regulatory environment is converging on lifecycle governance',
          description: 'FDA\'s January 2025 draft guidances emphasized lifecycle design, development, maintenance, documentation, and risk-based approaches for AI in medical devices and drug/biologic development.',
        },
      ],
    },
  },

  // ==========================================
  // Slide 4 — The Five Executive Questions
  // ==========================================
  {
    id: 'five-questions',
    title: 'Five Executive Questions',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'The Framework Answers Five Questions in Every Function',
      description: 'For each function, management should answer the same five questions. The fifth question is where most AI programs break down. It is not enough to license tools. Management has to decide what changes in organizational design, resource levels, and investment levels follow if the tools work.',
      levels: [
        {
          level: 1,
          title: 'Where does AI create measurable value in this function?',
          description: 'Identify the specific KPIs and outcomes that should improve.',
        },
        {
          level: 2,
          title: 'What work actually changes?',
          description: 'Define the workflow redesign required to capture value.',
        },
        {
          level: 3,
          title: 'What controls are required?',
          description: 'Establish governance proportionate to the risk and regulatory context.',
        },
        {
          level: 4,
          title: 'What is the right adoption path?',
          description: 'Determine whether to buy, embed, partner, or build.',
        },
        {
          level: 5,
          title: 'What has to change around the function for this to stick?',
          description: 'Address organizational design, resource levels, and investment levels.',
        },
      ],
    },
  },

  // ==========================================
  // Slide 5 — The Seven Operating Layers
  // ==========================================
  {
    id: 'seven-layers',
    title: 'Seven Operating Layers',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'Seven Layers of AI Adoption in Any Function',
      levels: [
        {
          level: 1,
          title: 'Value / KPI',
          description: 'What metric has to move for this to matter?',
        },
        {
          level: 2,
          title: 'Workflow redesign',
          description: 'What tasks, handoffs, decisions, and review steps change?',
        },
        {
          level: 3,
          title: 'Governance',
          description: 'What must be reviewed, logged, approved, validated, or escalated?',
        },
        {
          level: 4,
          title: 'Tool adoption path',
          description: 'What should be bought, embedded, partnered for, or built?',
        },
        {
          level: 5,
          title: 'Organizational design',
          description: 'What changes in decision rights, meeting forums, leadership voice, and cross-functional interfaces?',
        },
        {
          level: 6,
          title: 'Resource levels',
          description: 'Where do we need more people, different people, or shifted capacity because AI changes the volume or shape of work?',
        },
        {
          level: 7,
          title: 'Investment levels',
          description: 'What systems, integrations, controls, training, and workflow infrastructure require committed spend?',
        },
      ],
    },
  },

  // ==========================================
  // Slide 6 — The Question Bank by Layer
  // ==========================================
  {
    id: 'question-bank',
    title: 'Question Bank by Layer',
    type: 'list',
    content: {
      type: 'list',
      heading: 'What Leaders Should Ask in Every Function',
      description: 'These are the working questions behind the framework. The function detail that follows represents starting perspectives on how these questions have been answered where evidence exists.',
      groups: [
        {
          title: 'Value / KPI',
          icon: getIcon('metrics'),
          items: [
            { text: 'What metric is under pressure in this function today?' },
            { text: 'Is the target improvement speed, quality, cost, conversion, throughput, compliance, or capacity?' },
            { text: 'Is the KPI already measured well enough to show movement inside one quarter?' },
            { text: 'If the KPI moves, who changes behavior?' },
          ],
        },
        {
          title: 'Workflow redesign',
          icon: getIcon('automation'),
          items: [
            { text: 'What work is repetitive, synthesis-heavy, rules-based, or first-draft-heavy?' },
            { text: 'Where are the slowest handoffs?' },
            { text: 'What upstream step creates downstream rework?' },
            { text: 'What review layers will break if volume rises sharply?' },
            { text: 'What work can be accelerated without removing human judgment?' },
          ],
        },
        {
          title: 'Governance',
          icon: getIcon('shield'),
          items: [
            { text: 'What outputs are assistive versus determinative?' },
            { text: 'What must be auditable?' },
            { text: 'What requires approval before external use?' },
            { text: 'What requires human sign-off every time?' },
            { text: 'What risk tier does this use case sit in?' },
          ],
        },
        {
          title: 'Tool adoption path',
          icon: getIcon('code'),
          items: [
            { text: 'Is this a commodity capability or a source of differentiation?' },
            { text: 'Does the workflow need deep integration or just point productivity?' },
            { text: 'Is speed more important than fit, or fit more important than speed?' },
            { text: 'Does the vendor improve faster than we could?' },
            { text: 'What would make switching hard later?' },
          ],
        },
        {
          title: 'Organizational design',
          icon: getIcon('team'),
          items: [
            { text: 'Who should own AI decisions in this function?' },
            { text: 'Which meetings need this function represented earlier?' },
            { text: 'Where do decision rights need to move?' },
            { text: 'What new forum has to exist for rollout to work?' },
            { text: 'Does this function need a stronger voice upstream?' },
          ],
        },
        {
          title: 'Resource levels',
          icon: getIcon('users'),
          items: [
            { text: 'Will output volume rise faster than the team can absorb?' },
            { text: 'Will AI-generated work create more review burden elsewhere?' },
            { text: 'Where do we need more reviewers, validators, editors, or operators?' },
            { text: 'Which roles need upskilling versus additional hiring?' },
            { text: 'Where will time be reallocated, not just saved?' },
          ],
        },
        {
          title: 'Investment levels',
          icon: getIcon('money'),
          items: [
            { text: 'What enterprise tooling is required to support safe rollout?' },
            { text: 'What integrations must exist before adoption scales?' },
            { text: 'What QA or monitoring infrastructure is missing?' },
            { text: 'What training and enablement spend is required?' },
            { text: 'What ongoing budget is required for refresh and replacement?' },
          ],
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'The framework is only useful if these questions force operating decisions.',
      },
    },
  },

  // ==========================================
  // Slide 7 — Function Map
  // ==========================================
  {
    id: 'function-map',
    title: 'Function Map',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'One Framework, Eight Different Operating Realities',
      description: 'The following are starting perspectives, not prescriptions. They reflect patterns where evidence exists of what works in health tech operating environments.',
      columns: 2,
      items: [
        {
          title: 'Product management',
          description: 'Use AI to compress synthesis and documentation so PMs spend more time on judgment, sequencing, and cross-functional decision-making.',
          icon: getIcon('strategy'),
        },
        {
          title: 'Development',
          description: 'Use AI to increase throughput, but measure success in release velocity, defect escape, and cycle time — not just code generated.',
          icon: getIcon('code'),
        },
        {
          title: 'Quality',
          description: 'Use AI to strengthen review capacity and traceability, while repositioning quality as an early design partner rather than a late checkpoint.',
          icon: getIcon('shield'),
        },
        {
          title: 'Regulatory',
          description: 'Use AI to accelerate drafting, evidence organization, and consistency checking, but keep judgment, agency navigation, and compliance accountability human-led.',
          icon: getIcon('briefcase'),
        },
        {
          title: 'Delivery',
          description: 'Use AI to reduce implementation labor, compress time-to-launch, and standardize deployment quality where workflows are repeatable.',
          icon: getIcon('rocket'),
        },
        {
          title: 'Customer success',
          description: 'Use AI to improve account coverage, signal detection, and customer context, while keeping relationship ownership human.',
          icon: getIcon('users'),
        },
        {
          title: 'Commercial',
          description: 'Use AI to improve prep, targeting, content operations, and approved-message execution — not to create uncontrolled field behavior.',
          icon: getIcon('growth'),
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'Each function requires its own operating answer — applying the same AI playbook across functions is itself a failure mode.',
      },
    },
  },

  // ==========================================
  // Slide 8 — Function Detail: Product Management and Development
  // ==========================================
  {
    id: 'function-detail-pm-dev',
    title: 'Product Management & Development',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Function Detail: Product Management and Development',
      description: 'Starting perspectives based on current evidence. Each cell answers one layer question for this function.',
      headers: ['Layer', 'Product Management', 'Development'],
      columnWidths: ['15%', '42.5%', '42.5%'],
      highlightFirstColumn: true,
      rows: [
        [
          'Value / KPI',
          'Improve roadmap velocity, decision quality, and time from customer signal to product action.',
          'Improve developer throughput, release frequency, defect reduction, and cycle time from ticket to production.',
        ],
        [
          'Workflow redesign',
          'Reduce time on synthesis, drafting, and backlog prep so PM time shifts to prioritization and trade-off decisions.',
          'Speed code drafting, debugging, documentation, and test generation — but measure whether the full engineering system releases better software faster.',
        ],
        [
          'Governance',
          'Customer evidence and release rationale remain traceable; product ownership and prioritization stay human-owned.',
          'Code review, security review, test coverage, and IP policy cannot weaken as output volume rises; AI-generated code enters the same or stronger control process.',
        ],
        [
          'Tool adoption path',
          'Default to copilots embedded in existing product workflow before standalone tools; build only if proprietary workflow creates real advantage.',
          'Default to enterprise-grade coding and test tools before bespoke model development; build only where internal codebase context creates clear leverage.',
        ],
        [
          'Org design',
          'Product operations grows in importance; PMs shift from document production to driving alignment across engineering, quality, delivery, and commercial.',
          'Engineering productivity and platform engineering become more central; senior engineers become more leveraged as reviewers and standards-setters.',
        ],
        [
          'Resource levels',
          'First change is usually role mix and time allocation, not headcount reduction.',
          'Faster code generation often shifts the bottleneck to review, test, and release capacity — do not assume net headcount reduction.',
        ],
        [
          'Investment levels',
          'Prioritize integrations into systems of record, knowledge retrieval, and artifact traceability over novelty tooling.',
          'Invest in coding, testing, security, and review infrastructure before custom model work.',
        ],
      ],
    },
  },

  // ==========================================
  // Slide 9 — Function Detail: Quality and Regulatory
  // ==========================================
  {
    id: 'function-detail-quality-regulatory',
    title: 'Quality & Regulatory',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Function Detail: Quality and Regulatory',
      description: 'Starting perspectives based on current evidence. Each cell answers one layer question for this function.',
      headers: ['Layer', 'Quality', 'Regulatory'],
      columnWidths: ['15%', '42.5%', '42.5%'],
      highlightFirstColumn: true,
      rows: [
        [
          'Value / KPI',
          'Improve review throughput, traceability, defect prevention, audit readiness, and consistency of release decisions.',
          'Improve submission readiness, consistency, evidence organization, drafting cycle time, and responsiveness to agency or customer compliance requirements.',
        ],
        [
          'Workflow redesign',
          'Support test evidence review, document comparison, defect triage, and release-package preparation so quality spends less time on mechanical review and more on exception handling.',
          'Accelerate drafting support, cross-reference checking, and evidence compilation; agency strategy, interpretation, and final accountability remain human-led.',
        ],
        [
          'Governance',
          'Quality must define what is assistive, reviewable, auditable, and non-delegable; in regulated environments, evidence quality matters as much as speed.',
          'Regulatory outputs require strong provenance, version control, documented review, and clear separation between internal drafting assistance and regulated product functionality.',
        ],
        [
          'Tool adoption path',
          'Start with narrow assistive tools inside controlled review workflows; avoid autonomous quality decisions early.',
          'Start with internal drafting and evidence support tools; move carefully on anything affecting external claims, submissions, or customer-facing compliance representation.',
        ],
        [
          'Org design',
          'Quality needs a stronger upstream voice in product and development forums — it should help define rollout rules, not simply absorb consequences of faster upstream output.',
          'Regulatory should have a defined seat in AI-related product, quality, and governance discussions where external compliance or agency interaction may be affected.',
        ],
        [
          'Resource levels',
          'If development output increases materially, QA review and validation capacity may need to increase as well; AI often shifts workload into quality before reducing it.',
          'Early AI use in regulatory may increase expert review demand rather than reduce it.',
        ],
        [
          'Investment levels',
          'Invest in test evidence management, audit logs, review orchestration, and workflow-linked traceability before scaling AI-enabled development broadly.',
          'Invest in controlled content management, version tracking, retrieval, and evidence traceability before pursuing aggressive automation.',
        ],
      ],
    },
  },

  // ==========================================
  // Slide 10 — Function Detail: Delivery and Customer Success
  // ==========================================
  {
    id: 'function-detail-delivery-cs',
    title: 'Delivery & Customer Success',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Function Detail: Delivery and Customer Success',
      description: 'Starting perspectives based on current evidence. Each cell answers one layer question for this function.',
      headers: ['Layer', 'Delivery', 'Customer Success'],
      columnWidths: ['15%', '42.5%', '42.5%'],
      highlightFirstColumn: true,
      rows: [
        [
          'Value / KPI',
          'Reduce implementation labor, compress time-to-launch, improve deployment consistency, and increase project margin.',
          'Improve retention, expansion, onboarding health, issue resolution speed, and account coverage.',
        ],
        [
          'Workflow redesign',
          'Support implementation planning, requirements mapping, issue triage, configuration support, and reusable deployment playbooks so delivery teams spend less time on repetitive assembly.',
          'Support account summarization, risk flagging, renewal preparation, QBR drafting, and ticket synthesis so CSMs spend less time reconstructing context and more time intervening with customers.',
        ],
        [
          'Governance',
          'Customer-specific outputs, data handling, implementation approvals, and deployment quality standards remain controlled; faster delivery cannot increase customer-facing error rates.',
          'Customer communication, escalation thresholds, and service-level commitments remain controlled; AI may recommend actions but customer ownership stays human.',
        ],
        [
          'Tool adoption path',
          'Prioritize tools inside delivery workflows and knowledge systems; favor reusable assets over one-off automation.',
          'Start with internal copilots connected to product usage, support, and account history; delay customer-facing automation until internal signal quality is strong.',
        ],
        [
          'Org design',
          'Delivery leadership owns standardized AI-enabled playbooks and defines which parts of implementation can be scaled versus bespoke.',
          'Customer success operations becomes more important; the function needs tighter links to support, product, and commercial so AI-generated signals translate into action.',
        ],
        [
          'Resource levels',
          'Where implementation is structured, AI increases leverage of mid-level and junior staff; where implementation is highly bespoke, staffing impact may be limited.',
          'Scaled segments may absorb more accounts per CSM before high-touch strategic accounts do; do not assume uniform productivity gains across account tiers.',
        ],
        [
          'Investment levels',
          'Invest in knowledge capture, project workflow tooling, and implementation templates before highly customized AI.',
          'Invest in account context integration, product usage instrumentation, and health-score infrastructure before scaling generic AI assistants.',
        ],
      ],
    },
  },

  // ==========================================
  // Slide 11 — Function Detail: Commercial
  // ==========================================
  {
    id: 'function-detail-commercial',
    title: 'Commercial',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Function Detail: Commercial',
      description: 'Sales and marketing are bundled because the main operating questions are the same: where AI speeds preparation, targeting, and content operations without weakening message control.',
      headers: ['Layer', 'Commercial'],
      columnWidths: ['15%', '85%'],
      highlightFirstColumn: true,
      rows: [
        [
          'Value / KPI',
          'Improve rep productivity, campaign velocity, targeting quality, content throughput, conversion, and win rate.',
        ],
        [
          'Workflow redesign',
          'Support account research, segmentation, call prep, proposal drafting, content assembly, CRM hygiene, and approved-message retrieval so the team spends less time searching and assembling and more time executing in market.',
        ],
        [
          'Governance',
          'Claims, approved messaging, customer data handling, and external communication rules remain tightly controlled; AI strengthens execution inside the approved envelope, not outside it.',
        ],
        [
          'Tool adoption path',
          'Start with tools tied to approved content, CRM workflows, and market execution systems; avoid generic free-form generation as the primary commercial operating model.',
        ],
        [
          'Org design',
          'Commercial enablement becomes more strategic with a tighter standing interface with legal, medical, regulatory, and product marketing where controlled messaging matters.',
        ],
        [
          'Resource levels',
          'Early resource impact is often managerial and review-oriented rather than headcount reduction; teams may create more output before they create less work.',
        ],
        [
          'Investment levels',
          'Invest in approved-content retrieval, CRM integration, content workflow orchestration, and review pipelines before broad creative experimentation.',
        ],
      ],
    },
  },

  // ==========================================
  // Slide 12 — Default Recommendations
  // ==========================================
  {
    id: 'default-recommendations',
    title: 'Default Recommendations',
    type: 'comparison',
    content: {
      type: 'comparison',
      heading: 'Default Recommendations Before Going Function by Function',
      left: {
        title: 'Default to this',
        variant: 'positive',
        items: [
          'Extend AI first into functions where work is repetitive, synthesis-heavy, and bottlenecked by administrative burden rather than scarce expert judgment.',
          'Require every initiative to name a functional owner and a KPI.',
          'Treat workflow redesign as mandatory. Do not fund tool access alone.',
          'Default to buying or embedding before building.',
          'Pull quality and regulatory in early where external compliance, product claims, or release quality are affected.',
          'Separate organizational design questions from resource questions and from investment questions.',
          'Review the stack regularly. Do not assume first-generation tools are the long-term answer.',
        ],
      },
      right: {
        title: 'Avoid this',
        variant: 'negative',
        items: [
          'Pilot clutter',
          'License sprawl',
          'Flat governance',
          'No named owner',
          'Treating QA and regulatory as downstream checkpoints only',
          'Assuming productivity gains automatically equal lower headcount',
          'Building bespoke tools where the market is moving faster than the company can',
        ],
      },
      insightBox: {
        label: 'Bottom Line',
        text: 'AI rollout becomes practical when management stops admiring the opportunity set and starts forcing trade-offs.',
      },
    },
  },

  // ==========================================
  // Slide 13 — Closing
  // ==========================================
  {
    id: 'closing',
    title: 'What Good Looks Like',
    type: 'text',
    content: {
      type: 'text',
      heading: 'What Good Looks Like',
      body: [
        'A company is approaching AI adoption well when:',
        '• Each function has a named owner and KPI\n• Workflow redesign is explicit\n• Governance is proportionate to risk\n• Organizational design changes are intentional\n• Staffing impacts are addressed directly\n• Investment follows proof, not enthusiasm\n• The stack is reviewed and refreshed over time',
      ],
      insightBox: {
        label: 'Closing',
        text: 'AI adoption becomes real when each function knows what changes Monday morning.',
      },
    },
  },
]

export default slides
