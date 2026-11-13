import { Project, Service } from './types';
import auraBeautyImg from './src/assets/images/aura_beauty_flagship_1790852131321.jpg';
import verveStudioImg from './src/assets/images/verve_studio_architecture_1790852145439.jpg';
import nexusFlowImg from './src/assets/images/nexus_flow_dashboard_1790852157084.jpg';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Aura Beauty',
    category: 'E-Commerce',
    imageUrl: auraBeautyImg || '/images/aura_beauty_flagship_1790852131321.jpg',
    description: 'An online store for a natural skincare line.',
    longDescription: 'Aura wanted an online shop that felt as calm and gentle as their skincare line. We created a clean, fast storefront with big beautiful photos, clear product details, and a simple checkout that takes only seconds.',
    techStack: ['React', 'Shopify Plus', 'Tailwind CSS', 'Framer Motion'],
    challenge: 'Large high-resolution product photos were slowing down mobile browsing on phone networks.',
    solution: 'We tuned image sizes and kept the website code super lean so pages open instantly on any phone.',
    link: 'https://launchlayer-cellular-barrier-skincare.ai.studio'
  },
  {
    id: '2',
    title: 'Verve Studio',
    category: 'Architecture',
    imageUrl: verveStudioImg || '/images/verve_studio_architecture_1790852145439.jpg',
    description: 'A quiet, photo-first portfolio for an architecture studio.',
    longDescription: 'Verve designs peaceful, modern buildings. Their website reflects that same quiet approach: lots of breathing room, full-width photographs of completed homes, and short project notes without corporate clutter.',
    techStack: ['TypeScript', 'WebGL', 'Next.js', 'Tailwind CSS'],
    challenge: 'Galleries had dozens of high-res photos that could make quick scrolling feel choppy.',
    solution: 'We made photos load smoothly only as you scroll to them, keeping scrolling silky smooth on every screen.',
    link: 'https://noir-alpha-six.vercel.app/'
  },
  {
    id: '3',
    title: 'Nexus Flow',
    category: 'Fintech & SaaS',
    imageUrl: nexusFlowImg || '/images/nexus_flow_dashboard_1790852157084.jpg',
    description: 'A friendly financial dashboard for founders and small teams.',
    longDescription: 'Nexus helps small business owners keep an eye on sales and cash flow without getting overwhelmed. We built an intuitive dashboard that turns complicated spreadsheets into clear, easy-to-read charts.',
    techStack: ['React', 'D3.js', 'Node.js', 'WebSockets'],
    challenge: 'Showing live sales updates without making the web page lag or freeze.',
    solution: 'We simplified how data updates behind the scenes so the charts update quietly without interrupting what you are doing.',
    link: 'https://nexusflow.ai.studio'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'basic',
    title: 'The Landing Page',
    price: '$159',
    description: 'A clean, high-converting single-page website to introduce your business, share what you do, and turn visitors into clients.',
    imageUrl: auraBeautyImg || '/images/aura_beauty_flagship_1790852131321.jpg',
    features: [
      'Custom design crafted for your brand',
      'Fast loading and fully mobile-friendly',
      'Direct contact form sent to your email',
      'Basic SEO and Google search setup',
      'Delivered in about 5 business days'
    ]
  },
  {
    id: 'pro',
    title: 'The Full Website',
    price: '$449',
    description: 'A complete multi-page website with thoughtful details, clear storytelling, and an easy way for you to update text yourself.',
    imageUrl: verveStudioImg || '/images/verve_studio_architecture_1790852145439.jpg',
    features: [
      'Up to 5 custom-designed pages',
      'Smooth, gentle page animations',
      'Easy content editor so you can edit words anytime',
      'Speed audit and search engine optimization',
      '30 days of free updates and support after launch'
    ]
  },
  {
    id: 'enterprise',
    title: 'Custom Web App',
    price: '$999+',
    description: 'For when you need more than a website: custom member areas, dashboards, booking flows, or interactive tools.',
    imageUrl: nexusFlowImg || '/images/nexus_flow_dashboard_1790852157084.jpg',
    features: [
      'Modern full-stack React & TypeScript code',
      'User accounts and secure database storage',
      'Payment links, email alerts, and API connections',
      'Custom dashboards or interactive tools',
      'Reliable hosting setup and launch guidance'
    ]
  }
];
