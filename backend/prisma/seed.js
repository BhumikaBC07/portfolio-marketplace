const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const portfolios = [
  // Full Stack / Java Engineer
  {
    title: 'JavaCraft Pro',
    description: 'Enterprise-grade Java full-stack portfolio showcasing microservices, Spring Boot, and React applications.',
    longDescription: 'A comprehensive portfolio template built for senior Java engineers. Features a stunning dark/light mode dashboard, animated project showcases, skill radars, and timeline components. Includes Spring Boot API demos, Docker configurations, and CI/CD pipeline visuals.',
    category: 'FULL_STACK',
    price: 0,
    tier: 'FREE',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    previewUrl: 'https://example.com/preview/javacraft',
    techStack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    rating: 4.8,
    ratingCount: 124,
    downloads: 892,
    featured: true,
  },
  {
    title: 'FullStack Architect',
    description: 'Premium portfolio for senior engineers with live API playground, system design diagrams, and GitHub integrations.',
    longDescription: 'Designed for architects and tech leads. Includes an interactive API playground where visitors can test your endpoints live, system design whiteboard showcases, and automated GitHub contribution graphs. Features animated hero with particle systems.',
    category: 'FULL_STACK',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    previewUrl: 'https://example.com/preview/fullstack-architect',
    techStack: ['Java', 'Microservices', 'Kubernetes', 'React', 'Node.js', 'Redis'],
    rating: 4.9,
    ratingCount: 87,
    downloads: 456,
    featured: true,
  },
  {
    title: 'SpringVault Portfolio',
    description: 'Clean, minimal portfolio for Java backend engineers with code snippet showcases and performance metrics.',
    longDescription: 'Minimalist yet powerful portfolio for backend specialists. Features code snippet showcases with syntax highlighting, performance benchmark displays, and architecture diagram sections. Perfect for backend engineers who want their code to speak for itself.',
    category: 'FULL_STACK',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    previewUrl: 'https://example.com/preview/springvault',
    techStack: ['Spring Boot', 'Hibernate', 'MySQL', 'JUnit 5', 'Mockito', 'Maven'],
    rating: 4.6,
    ratingCount: 63,
    downloads: 334,
    featured: false,
  },
  {
    title: 'EnterpriseStack Elite',
    description: 'Agency-tier portfolio for engineering leads. Includes team showcase, case studies, and consulting inquiry forms.',
    longDescription: 'The ultimate portfolio for consultants and engineering managers. Includes team member sections, detailed case study layouts with metrics, client testimonial systems, and integrated inquiry forms. Built with enterprise aesthetics and professional polish.',
    category: 'FULL_STACK',
    price: 29,
    tier: 'AGENCY',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    previewUrl: 'https://example.com/preview/enterprise-elite',
    techStack: ['Java', 'Spring Cloud', 'React', 'TypeScript', 'AWS', 'Terraform'],
    rating: 5.0,
    ratingCount: 42,
    downloads: 198,
    featured: true,
  },

  // Web Developer
  {
    title: 'WebWeave Studio',
    description: 'Creative web developer portfolio with animated project reveals, skills constellation, and dark editorial theme.',
    longDescription: 'A visually stunning portfolio for creative web developers. Features scroll-triggered project reveals, an interactive skills constellation visualization, and a dark editorial theme with warm amber accents. Includes blog section and contact form.',
    category: 'WEB_DEVELOPER',
    price: 0,
    tier: 'FREE',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    previewUrl: 'https://example.com/preview/webweave',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GSAP', 'Webpack'],
    rating: 4.7,
    ratingCount: 156,
    downloads: 1203,
    featured: true,
  },
  {
    title: 'NextFolio Pro',
    description: 'Next.js 14 powered portfolio with SSR, ISR, perfect Lighthouse scores, and CMS integration.',
    longDescription: 'Built for performance-obsessed developers. Achieves perfect 100/100 Lighthouse scores out of the box. Includes Contentful CMS integration for easy content updates, automated OG image generation, and RSS feed. Features elegant serif typography and editorial layout.',
    category: 'WEB_DEVELOPER',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    previewUrl: 'https://example.com/preview/nextfolio',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Contentful', 'Vercel', 'Prisma'],
    rating: 4.9,
    ratingCount: 98,
    downloads: 567,
    featured: false,
  },
  {
    title: 'PixelPerfect Portfolio',
    description: 'CSS-forward portfolio showcasing animation mastery, custom cursor effects, and cross-browser pixel perfection.',
    longDescription: 'For developers who consider CSS an art form. Features elaborate CSS-only animations, custom magnetic cursor effects, horizontal scroll sections, and creative hover states. Demonstrates mastery of modern CSS: grid, container queries, and custom properties.',
    category: 'WEB_DEVELOPER',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&q=80',
    previewUrl: 'https://example.com/preview/pixelperfect',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Lenis', 'Vite'],
    rating: 4.8,
    ratingCount: 74,
    downloads: 389,
    featured: false,
  },
  {
    title: 'Agency Architect Web',
    description: 'Full agency website template for freelance web developers. Includes services, case studies, and client portal.',
    longDescription: 'Transform your freelance business with a full agency presentation. Includes service pricing tables, detailed case study templates, client testimonial management, and a password-protected client portal for project updates. Built with Framer Motion animations.',
    category: 'WEB_DEVELOPER',
    price: 29,
    tier: 'AGENCY',
    imageUrl: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&q=80',
    previewUrl: 'https://example.com/preview/agency-architect',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Sanity CMS', 'Stripe', 'Auth.js'],
    rating: 4.9,
    ratingCount: 51,
    downloads: 234,
    featured: true,
  },

  // UI/UX Designer
  {
    title: 'DesignCanvas Free',
    description: 'Clean, case-study focused portfolio for UI/UX designers with process documentation and prototype embeds.',
    longDescription: 'The standard for design portfolios. Features structured case study layouts with problem/solution/outcome framework, Figma prototype embeds, before/after comparisons, and design system showcase sections. Clean editorial aesthetic that lets the work shine.',
    category: 'UI_UX_DESIGNER',
    price: 0,
    tier: 'FREE',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    previewUrl: 'https://example.com/preview/designcanvas',
    techStack: ['Figma', 'Framer', 'Principle', 'Adobe XD', 'Maze', 'Notion'],
    rating: 4.6,
    ratingCount: 189,
    downloads: 1456,
    featured: false,
  },
  {
    title: 'Craft & Motion Studio',
    description: 'Premium designer portfolio with motion design showcases, interactive prototypes, and design system gallery.',
    longDescription: 'For designers who push pixels and motion. Features full-screen video showreels, interactive prototype galleries, design token documentation, and component library showcases. Includes sections for brand identity work, UI systems, and mobile app designs.',
    category: 'UI_UX_DESIGNER',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
    previewUrl: 'https://example.com/preview/craft-motion',
    techStack: ['Figma', 'After Effects', 'Lottie', 'Framer Motion', 'Principle', 'ProtoPie'],
    rating: 4.9,
    ratingCount: 112,
    downloads: 678,
    featured: true,
  },
  {
    title: 'UX Research Portfolio',
    description: 'Research-led portfolio for UX strategists with user interview highlights, journey maps, and data visualizations.',
    longDescription: 'Built for UX researchers and strategists. Features structured research case studies with methodology documentation, user interview highlight reels, journey map displays, and quantitative data visualizations. Demonstrates both research rigor and design thinking.',
    category: 'UI_UX_DESIGNER',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&q=80',
    previewUrl: 'https://example.com/preview/ux-research',
    techStack: ['Figma', 'Miro', 'UserTesting', 'Lookback', 'Dovetail', 'Optimal Workshop'],
    rating: 4.7,
    ratingCount: 67,
    downloads: 312,
    featured: false,
  },
  {
    title: 'Design Director Elite',
    description: 'Agency-tier portfolio for design directors. Features team management, brand guidelines, and client acquisition tools.',
    longDescription: 'The portfolio for creative directors and design leads. Features team portfolio management where you can showcase your entire team\'s work, brand guideline document generation, white-label client presentation mode, and integrated proposal tools with e-signature.',
    category: 'UI_UX_DESIGNER',
    price: 29,
    tier: 'AGENCY',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80',
    previewUrl: 'https://example.com/preview/design-director',
    techStack: ['Figma', 'Webflow', 'Framer', 'HubSpot', 'DocuSign', 'Notion'],
    rating: 5.0,
    ratingCount: 38,
    downloads: 167,
    featured: false,
  },

  // Data Scientist / ML Engineer
  {
    title: 'DataNarrative Free',
    description: 'Open-source style data science portfolio with Jupyter notebook embeds, model cards, and dataset showcases.',
    longDescription: 'Built for the data science community. Features embedded Jupyter notebooks with live code execution, model card templates following ML best practices, dataset showcase sections, and publication/paper highlights. Clean academic aesthetic with warm editorial touches.',
    category: 'DATA_SCIENTIST',
    price: 0,
    tier: 'FREE',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    previewUrl: 'https://example.com/preview/datnarrative',
    techStack: ['Python', 'Jupyter', 'Pandas', 'scikit-learn', 'Matplotlib', 'GitHub'],
    rating: 4.5,
    ratingCount: 143,
    downloads: 987,
    featured: false,
  },
  {
    title: 'MLOps Engineer Portfolio',
    description: 'Pro portfolio for ML engineers with live model demos, Hugging Face integrations, and MLflow experiment tracking.',
    longDescription: 'Designed for production ML engineers. Features live model inference demos via API calls, Hugging Face Space embeds, MLflow experiment visualization, model performance dashboards, and deployment architecture diagrams. Demonstrates the full ML lifecycle.',
    category: 'DATA_SCIENTIST',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    previewUrl: 'https://example.com/preview/mlops-engineer',
    techStack: ['Python', 'PyTorch', 'MLflow', 'FastAPI', 'Docker', 'Kubernetes', 'AWS SageMaker'],
    rating: 4.8,
    ratingCount: 89,
    downloads: 445,
    featured: true,
  },
  {
    title: 'AI Research Showcase',
    description: 'Academic-meets-industry portfolio for AI researchers with paper visualizations, citation graphs, and talk archives.',
    longDescription: 'For AI researchers bridging academia and industry. Features interactive paper visualizations, citation network graphs, conference talk video archives, and research impact metrics. Includes sections for patents, datasets released, and open-source contributions.',
    category: 'DATA_SCIENTIST',
    price: 9,
    tier: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    previewUrl: 'https://example.com/preview/ai-research',
    techStack: ['Python', 'TensorFlow', 'JAX', 'Weights & Biases', 'Hugging Face', 'LaTeX'],
    rating: 4.9,
    ratingCount: 56,
    downloads: 289,
    featured: false,
  },
  {
    title: 'DataViz Agency Suite',
    description: 'Agency-tier portfolio for data teams with interactive dashboards, real-time visualizations, and client reporting tools.',
    longDescription: 'The complete package for data consultancies. Features embedded interactive D3.js and Observable dashboards, real-time data visualization demos, client reporting templates, and ROI calculators. Includes case studies with business impact metrics and client logos.',
    category: 'DATA_SCIENTIST',
    price: 29,
    tier: 'AGENCY',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    previewUrl: 'https://example.com/preview/dataviz-agency',
    techStack: ['Python', 'R', 'D3.js', 'Tableau', 'Looker', 'dbt', 'Snowflake'],
    rating: 4.9,
    ratingCount: 44,
    downloads: 201,
    featured: false,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portfoliohub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@portfoliohub.com',
      password: adminPassword,
      role: 'ADMIN',
      plan: 'AGENCY',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Bhumika Dev',
      email: 'test@example.com',
      password: userPassword,
      role: 'USER',
      plan: 'PRO',
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Create portfolios
  for (const portfolio of portfolios) {
    const created = await prisma.portfolio.upsert({
      where: { id: portfolio.title.toLowerCase().replace(/\s+/g, '-') },
      update: portfolio,
      create: {
        id: portfolio.title.toLowerCase().replace(/\s+/g, '-'),
        ...portfolio,
      },
    });
    console.log('✅ Portfolio created:', created.title);
  }

  // Add some reviews
  const allPortfolios = await prisma.portfolio.findMany({ take: 4 });
  const reviews = [
    { rating: 5, comment: 'Absolutely stunning portfolio. Got my dream job within 2 weeks of using this template!' },
    { rating: 5, comment: 'The code quality is exceptional. Well-documented and easy to customize.' },
    { rating: 4, comment: 'Great design, took a bit to set up but totally worth it.' },
    { rating: 5, comment: 'Professional, clean, and stands out. Highly recommend for senior engineers.' },
  ];

  for (let i = 0; i < allPortfolios.length; i++) {
    await prisma.review.create({
      data: {
        userId: testUser.id,
        portfolioId: allPortfolios[i].id,
        ...reviews[i],
      },
    });
  }
  console.log('✅ Reviews created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin: admin@portfoliohub.com / admin123');
  console.log('User:  test@example.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
