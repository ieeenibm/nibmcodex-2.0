export interface Speaker {
  id: string;
  name: string;
  salutation?: string;
  title: string;
  company: string;
  image: string;
  tag: string;
  isChiefGuest?: boolean;
  credentials?: string[];
  shortBio: string;
  fullBio: string;
  linkedin?: string;
}

export interface SummitHighlight {
  title: string;
  description: string;
  iconName: string;
}

export const SUMMIT_INFO = {
  title: 'Code Grid Summit 2026',
  subtitle: 'The AI Summit',
  theme: 'Where Academia Ends, Industry Begins',
  dateDisplay: 'Saturday, 12th September 2026',
  timeDisplay: '08:00 AM – 04:30 PM (SLST)',
  venue: 'NIBM Colombo Campus',
  isTomorrow: true,
  description:
    'Our flagship full-day technology summit confronting the academia-industry gap. Uniting top-tier government dignitaries, AI innovators, cybersecurity veterans, and tech executives for high-impact sessions on AI-native delivery, enterprise data, career mastery, and the future of work.',
};

export const SUMMIT_TRACKS: SummitHighlight[] = [
  {
    title: 'AI-Native Software Delivery',
    description: 'Operationalizing AI-DLC, pairing specialized agents with human engineers to deliver production-grade scalable systems.',
    iconName: 'Cpu',
  },
  {
    title: 'Cybersecurity & Data Privacy (PDPA)',
    description: 'Inline network security stacks, VSaaS, regulatory readiness, and enterprise resilience against modern cyber threats.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Generative AI & Intelligent Systems',
    description: 'Applied GenAI, multi-modal agents, blockchain architectures, and building production solutions that enrich human life.',
    iconName: 'Sparkles',
  },
  {
    title: 'Enterprise Data & Product Strategy',
    description: 'Transforming complex data challenges into customer-centric, value-driven AI products and business innovation.',
    iconName: 'TrendingUp',
  },
  {
    title: 'Talent, Culture & Industry Readiness',
    description: 'Building future-ready workplaces, engineering leadership, and bridging the gap between university education and real-world tech.',
    iconName: 'Users',
  },
  {
    title: 'Interactive Live Game Arenas',
    description: 'Real-time interactive Quiz Arena and AI vs Human image detection challenges running live with 180+ attendees.',
    iconName: 'Gamepad2',
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: 'waruna-dhanapala',
    name: 'Mr. Waruna Sri Dhanapala',
    title: 'Acting Secretary',
    company: 'Ministry of Digital Economy',
    isChiefGuest: true,
    tag: 'Chief Guest & Keynote Dignitary',
    image: '/speakers/waruna.png',
    credentials: [
      'Special Grade Officer of the Sri Lanka Administrative Service (SLAS)',
      'MSc. in International Development Studies (GRIPS, Japan)',
      'MSc. in Public Administration (PIM, University of Sri Jayewardenepura)',
      'BSc (Special Degree) in Geology & Computer Science (University of Peradeniya)',
    ],
    shortBio:
      'Acting Secretary to the Ministry of Digital Economy and Special Grade Officer of the SLAS with 25+ years leading digital infrastructure, regional administration reforms, and national data protection.',
    fullBio:
      'Mr. Waruna Sri Dhanapala is the Acting Secretary to the Ministry of Digital Economy and a Special Grade Officer of the Sri Lanka Administrative Service (SLAS) with over 25 years of experience. He earlier served as the Additional Secretary (Regional Administration Reforms) at the Ministry in charge of Home Affairs (Sep 2020 – Nov 2024) and Acting Director General of the Data Protection Authority (Nov 2023 – Nov 2024).\n\nHis previous positions include Additional Secretary/Senior Assistant Secretary of the Ministry of Digital Infrastructure (2016 – 2020), the Presidential Secretariat (2001 – 2005 and 2007 – 2011) and the Ministry of Environment (2015).\n\nAs the Minister Counsellor at the Permanent Mission of Sri Lanka to the United Nations in New York (2012 – 2014) Mr. Dhanapala contributed to the formation of SDGs. In 2013, the UN General Assembly unanimously elected him as Vice Chair of the Economic & Finance Committee and was in charge of several key Resolutions on technology and global issues.\n\nHe holds a Master’s Degree in International Development Studies from the National Graduate Institute for Policy Studies (Japan), a Master’s in Public Administration from PIM (University of Sri Jayewardenepura) and a BSc (Special Degree) in Geology & Computer Science from the University of Peradeniya.\n\nMr. Dhanapala is a Professional Member of the Computer Society of Sri Lanka (CSSL) and the General Secretary of the Japanese Graduates’ Association of Sri Lanka (JaGAAS).',
  },
  {
    id: 'sachith-perera',
    name: 'Mr. Sachith Perera',
    title: 'Chief Technology Officer',
    company: '99x Technology',
    tag: 'AI-Native Software Delivery',
    image: '/speakers/sachith.jpg',
    shortBio:
      'CTO at 99x spearheading the global shift toward AI-native software delivery and pioneer of the open-source Intent Delivery Framework (IDF).',
    fullBio:
      'As Chief Technology Officer at 99x, Sachith leads the organization’s shift toward AI-native software delivery. Building on 2+ years as Senior Director - Technology and a foundation in software architecture and web application development, he focuses on redefining how software gets built in an AI-first world.\n\nHe recently led the development and launch of the 99x Intent Delivery Framework (IDF), an open-source platform that operationalizes AI-DLC (AI-Driven Development Life Cycle), pairing specialized AI agents with Forward Deployed Engineers in ISO-certified delivery pods, so teams get AI\'s speed and scale without losing human judgment, accountability, and customer understanding.\n\nHis focus is on translating emerging AI capabilities into production-grade delivery models that scale, aligning with 99x\'s mission to push technology forward with continuous learning and customer-centric problem-solving.',
  },
  {
    id: 'don-ramesh-indika',
    name: 'Mr. Don Ramesh Indika',
    title: 'Head – Cyber & Physical Security, ICT & Digital Solutions',
    company: 'Dialog Axiata PLC',
    tag: 'Cybersecurity & Enterprise Resilience',
    image: '/speakers/don.jpg',
    credentials: [
      'MSc in Cyber Security (University of Staffordshire)',
      'Certified Data Protection Officer (C-DPO, Sri Lanka PDPA)',
    ],
    shortBio:
      'Accomplished technology executive with 25+ years in ICT, pioneering Inline Network Cybersecurity Stacks and VSaaS across enterprise networks in Sri Lanka.',
    fullBio:
      'Accomplished senior business and technology executive with over 25+ years of experience in the ICT industry, with proven leadership expertise in business management, product development, and complex ICT solution engineering. Currently serves as Head – Cyber Security & Physical Security, ICT & Digital Solutions at Dialog Axiata PLC, leading strategic growth initiatives across cybersecurity, data privacy, physical security and enterprise technology solutions.\n\nRecognized for pioneering the introduction of Inline Network Cybersecurity Stacks and Video Surveillance as a Service (VSaaS) in Sri Lanka, driving innovation, market differentiation, and new recurring revenue streams. Demonstrated ability to align business strategy with strong technical execution, delivering transformative security and privacy programs that strengthen cyber resilience, operational continuity, and regulatory readiness for enterprise customers.\n\nHolds a Master of Science (MSc) in Cyber Security from University of Staffordshire and is a Certified Data Protection Officer (C-DPO), accredited through the CICRA program aligned with Sri Lanka’s Personal Data Protection Act (PDPA).',
  },
  {
    id: 'dilan-perera',
    name: 'Mr. B.C. Dilan Perera',
    title: 'CEO and Chief Software Architect',
    company: 'Dilexus Infotech',
    tag: 'Generative AI & Intelligent Systems',
    image: '/speakers/dilan.jpg',
    shortBio:
      'Visionary tech entrepreneur and architect with expertise in Generative AI, intelligent autonomous systems, mobile engineering, and blockchain.',
    fullBio:
      'Dilan is a visionary technology entrepreneur and technical leader with expertise in generative artificial intelligence, software engineering, blockchain, and mobile development. As the founder of Dilexus Infotech, he is dedicated to creating innovative technology solutions and exploring the transformative potential of AI and intelligent systems.\n\nThroughout his career, he has collaborated with leading organizations, including ICTA Sri Lanka, WSO2, and Activate Singapore, combining deep technical expertise with entrepreneurial insight to deliver meaningful impact and advance the future of technology. His vision is to harness technology and AI to enrich human life and empower individuals, businesses, and governments to embrace innovation, unlock their potential, and build a smarter, more inclusive, and sustainable future for all.',
  },
  {
    id: 'sampath-gamage',
    name: 'Mr. Sampath Gamage',
    title: 'Director & Co-Founder',
    company: 'InfoSurv / nearby.lk',
    tag: 'Startups & Digital Innovation',
    image: '/speakers/sampath.jpg',
    credentials: [
      'B.Sc. in Management Information Systems (UCD, Ireland)',
      'Master in Information Technology (UCSC, University of Colombo)',
    ],
    shortBio:
      'Distinguished startup mentor, entrepreneur, and lecturer. Co-Founder of nearby.lk, Infosurv, and Toursurv, and ICTA Spiralation award winner.',
    fullBio:
      'Mr. Sampath Gamage is a distinguished entrepreneur, technology leader, startup mentor, and lecturer with extensive experience in digital innovation and business development. He holds Bachelor of Science in Management Information Systems (B.Sc. in MIS) from University College Dublin (UCD), Ireland, and Master in Information Technology (MIT) from the University of Colombo, School of Computing (UCSC).\n\nHe is the Co-Founder of nearby.lk and Infosurv Lanka (Pvt) Ltd, and the Founder & CEO of Toursurv (Pvt) Ltd and the Founder & Managing Director of Revo Interactive (Pvt) Ltd. His entrepreneurial achievements include winning the "Spiralation", ICTA support initiative for Tech Start-ups in 2013 and being shortlisted as country representation for the WSA Mobile Congress (2015) held in Abu Dhabi.\n\nAs a Visiting Lecturer at NIBM and startup mentor, Mr. Sampath is passionate about nurturing future entrepreneurs and empowering startups to transform innovative ideas into impactful, technology-driven businesses.',
  },
  {
    id: 'yasoma-jayasinghe',
    name: 'Mr. Yasoma Jayasinghe',
    title: 'Senior Engineering Manager',
    company: 'Virtusa',
    tag: 'Engineering Strategy & AI Enablement',
    image: '/speakers/yasoma.jpg',
    credentials: [
      'MSc in Computer Science',
      'Master of Business Administration (MBA)',
      'BSc in Mathematics',
      'Doctor of Business Administration (DBA) Candidate (University of Colombo)',
    ],
    shortBio:
      'Senior Engineering Manager at Virtusa with 25+ years leading technology strategy, AI-enabled software delivery, and former SLASSCOM General Council Member.',
    fullBio:
      'Yasoma Jayasinghe is a Senior Engineering Manager at Virtusa with more than 25 years of experience in software engineering leadership, technology strategy, programme delivery and business transformation. He actively leads initiatives in AI-enabled software development, engineering productivity and industry–academia collaboration.\n\nHe has also served as a General Council Member of SLASSCOM and contributed to programmes aimed at developing Sri Lanka’s technology talent ecosystem. He holds an MSc in Computer Science, an MBA and a BSc in Mathematics, and is currently pursuing his Doctor of Business Administration (DBA) research at the University of Colombo.',
  },
  {
    id: 'thisari-panawala',
    name: 'Ms. Thisari Panawala',
    title: 'Head of People and Culture',
    company: 'VitalHub',
    tag: 'People Strategy & Future of Work',
    image: '/speakers/thisari.jpg',
    shortBio:
      'HR executive with 14+ years across tech, telecom, and manufacturing, championing future-ready workplaces and industry-academia talent integration.',
    fullBio:
      'Thisari Panawala is a Human Resources professional with over 14 years of experience across the IT, telecommunications, and manufacturing sectors. She currently serves as the Head of People and Culture at VitalHub Pvt Ltd, where she leads the people strategy and HR function supporting a fast-growing technology organization.\n\nWith extensive experience in talent management, organizational development, employee experience, and HR transformation, Thisari is passionate about building future-ready workplaces and developing talent that can thrive in an increasingly technology-driven world. She has also been actively involved in industry-academia initiatives, engaging with universities and professional communities to help bridge the gap between education and evolving industry requirements.',
  },
  {
    id: 'nimnaz-shereen',
    name: 'Ms. Nimnaz Shereen',
    title: 'Senior Product Manager - Data & AI',
    company: 'Dialog Axiata PLC',
    tag: 'Data & Enterprise AI Product Strategy',
    image: '/speakers/nimnaz.png',
    credentials: [
      'BSc. Eng in Electrical & Electronic Engineering (University of Peradeniya)',
      'MBA with Gold Medal for Excellent Academic Performance (Cardiff Metropolitan University, UK)',
    ],
    shortBio:
      'Senior Product Manager in Data & AI at Dialog Enterprise with 10+ years shaping product strategy, predictive analytics, and enterprise digital transformation.',
    fullBio:
      'Nimnaz Shereen is a Senior Product Manager specializing in Data & AI at Dialog Enterprise, with more than ten years of experience across product strategy, data analytics, enterprise technology, digital transformation, and business innovation. Working at the intersection of technology and business, she helps translate complex challenges into practical, value-driven solutions that create meaningful outcomes for organizations and their customers.\n\nShe graduated in Electrical and Electronic Engineering, Faculty of Engineering, University of Peradeniya, and holds a Master of Business Administration from Cardiff Metropolitan University, UK, where she was awarded the Gold Medal for Excellent Academic Performance. Her career journey brings together engineering, business strategy, product leadership, and innovation, giving her a well-rounded perspective on how ideas move from concept to real-world impact.\n\nThroughout her career, Shereen has led high-impact initiatives in product management, analytics, sustainability, program delivery, and organizational transformation. She has worked closely with multidisciplinary teams and senior stakeholders locally and globally, combining analytical thinking, customer insight, and strategic leadership to shape products, programs, and solutions for evolving business needs. Passionate about continuous learning and industry-academia collaboration, Shereen actively shares practical insights with students and aspiring professionals.',
  },
];
