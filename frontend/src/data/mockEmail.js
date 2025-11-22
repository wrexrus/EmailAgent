export const mockEmails = [
  {
    id: '1',
    sender: 'Sarah Chen',
    senderEmail: 'sarah.chen@acmecorp.com',
    subject: 'Q4 Project Deadline - Action Required',
    preview: 'Hi team, we need to finalize the Q4 project deliverables by end of week...',
    content: `Hi team,

We need to finalize the Q4 project deliverables by end of week. Please review the attached documents and confirm your section is complete.

Key action items:
- Review budget allocation
- Complete final testing phase
- Prepare presentation slides

Let me know if you have any blockers.

Best,
Sarah`,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'important',
    read: false,
    actionItems: ['Review budget allocation', 'Complete final testing phase', 'Prepare presentation slides']
  },
  {
    id: '2',
    sender: 'TechCrunch Newsletter',
    senderEmail: 'newsletter@techcrunch.com',
    subject: 'This Week in AI: Top 10 Developments',
    preview: 'Your weekly dose of AI news and innovations...',
    content: `This Week in AI: Top 10 Developments

1. New LLM breakthrough from OpenAI
2. Google announces Gemini updates
3. AI regulation discussions in EU

[Read more...]`,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'newsletter',
    read: true
  },
  {
    id: '3',
    sender: 'LinkedIn',
    senderEmail: 'notifications@linkedin.com',
    subject: 'You have 15 new connection requests',
    preview: 'People are reaching out to connect with you...',
    content: `You have 15 new connection requests waiting for your response.

View all pending invitations on LinkedIn.`,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: 'spam',
    read: true
  },
  {
    id: '4',
    sender: 'Marcus Johnson',
    senderEmail: 'marcus.j@designstudio.io',
    subject: 'Client Meeting Notes & Follow-ups',
    preview: 'Thanks for the productive meeting today. Here are my notes...',
    content: `Thanks for the productive meeting today. Here are my notes and action items:

Meeting Summary:
- Client approved initial designs
- Budget increased by 20%
- Timeline extended to March

Follow-ups needed:
- Send updated contract by Friday
- Schedule design review for next week
- Request brand assets from client

Marcus`,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'todo',
    read: false,
    actionItems: ['Send updated contract by Friday', 'Schedule design review', 'Request brand assets']
  },
  {
    id: '5',
    sender: 'Emma Rodriguez',
    senderEmail: 'emma.r@innovation-lab.com',
    subject: 'Research Paper Collaboration Opportunity',
    preview: 'I came across your recent work on AI agent systems...',
    content: `Hi there,

I came across your recent work on AI agent systems and I'm impressed with your approach. I'm currently working on a research paper about prompt engineering and would love to collaborate.

Would you be interested in a quick call next week to discuss?

Best regards,
Emma Rodriguez
Senior Researcher, Innovation Lab`,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    category: 'important',
    read: true
  },
  {
    id: '6',
    sender: 'Product Hunt',
    senderEmail: 'digest@producthunt.com',
    subject: 'Top 10 Products This Week',
    preview: 'Check out the most upvoted products from the past 7 days...',
    content: `🚀 Top 10 Products This Week

1. AI Email Assistant - 1.2k upvotes
2. No-Code Dashboard Builder - 987 upvotes
3. Smart Calendar App - 856 upvotes

Discover more innovative products on Product Hunt!`,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: 'newsletter',
    read: false
  },
  {
    id: '7',
    sender: 'David Park',
    senderEmail: 'd.park@venture-capital.com',
    subject: 'Investment Proposal Discussion',
    preview: 'Following up on our conversation last month...',
    content: `Hi,

Following up on our conversation last month about your startup. Our partners have reviewed your pitch deck and we'd like to schedule a formal presentation.

Are you available for a meeting next Tuesday or Wednesday?

Also, please send over:
- Updated financial projections
- Current cap table
- Product roadmap

Looking forward to hearing from you.

David Park
Partner, Venture Capital Firm`,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    category: 'important',
    read: false,
    actionItems: ['Send updated financial projections', 'Send current cap table', 'Send product roadmap', 'Schedule meeting']
  },
  {
    id: '8',
    sender: 'Amazon',
    senderEmail: 'shipment@amazon.com',
    subject: 'Your package will arrive tomorrow',
    preview: 'Good news! Your order #123-4567890 is out for delivery...',
    content: `Good news! Your order #123-4567890 is out for delivery and will arrive tomorrow by 8pm.

Track your package: [link]

Order details:
- Wireless Headphones
- USB-C Cable (2-pack)

Total: $89.99`,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    category: 'general',
    read: true
  },
  {
    id: '9',
    sender: 'Spam Bot',
    senderEmail: 'offers@random-deals.xyz',
    subject: '🎉 You Won $1,000,000! Claim Now!!!',
    preview: 'CONGRATULATIONS! You have been selected as our lucky winner...',
    content: `CONGRATULATIONS! 

You have been selected as our lucky winner! Click here to claim your prize of $1,000,000!!!

Act fast - this offer expires in 24 hours!

[Suspicious link]`,
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    category: 'spam',
    read: false
  },
  {
    id: '10',
    sender: 'Julia Martinez',
    senderEmail: 'julia.m@freelance.com',
    subject: 'Invoice #2024-045 - Payment Due',
    preview: 'Attached is the invoice for the completed design work...',
    content: `Hi,

Attached is the invoice for the completed design work on your landing page project.

Invoice Details:
- Invoice #: 2024-045
- Amount: $2,500
- Due Date: January 30, 2024
- Payment methods: Bank transfer or PayPal

Please confirm receipt and let me know if you have any questions.

Thanks!
Julia Martinez`,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: 'todo',
    read: false,
    actionItems: ['Review invoice', 'Process payment by January 30']
  }
];
