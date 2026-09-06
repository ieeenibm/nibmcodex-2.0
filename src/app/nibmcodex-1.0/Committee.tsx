'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

const execBoard = [
  {
    name: 'Pradeesha Hettiarachchi',
    role: 'Chairperson - Executive Committee',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/h2',
    linkedin: 'https://www.linkedin.com/in/pradeesha-hettiarachchi',
  },
  {
    name: 'Pabodha Thathsarani Ihalagama',
    role: 'Vice Chair - Executive Committee',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/h4',
    linkedin: 'https://www.linkedin.com/in/pabodha-ihalagama',
  },
  {
    name: 'Thusathmi Sapumanage',
    role: 'Secretary - Executive Committee',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/h3',
    linkedin: 'https://www.linkedin.com/in/thusathmi-sapumanage',
  },
];

const ambassador = {
  name: 'Thenuja Dulwana',
  role: 'Student Branch Ambassador',
  image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/h1',
  linkedin: 'https://www.linkedin.com/in/thenujadulwana',
};

const proctor = {
  name: 'Mr. Niranga Dharmaratna',
  role: 'Proctor',
  image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/p1',
  linkedin: 'https://www.linkedin.com/in/niranga-shashi-dharmaratna/',
};

interface TeamMember {
  first: string;
  last: string;
  position: string;
  linkedin: string;
  img: string;
}

interface Team {
  name: string;
  members: TeamMember[];
}

const teamsData: Team[] = [
  {
    name: 'Digital',
    members: [
      { first: 'Amjad', last: 'Azward', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/amjad-a-076262297/', img: 'teams/digital/m1.jpg' },
      { first: 'Shan', last: 'Kongahage', position: 'Co-Lead', linkedin: 'https://www.linkedin.com/in/shan-kongahage', img: 'teams/digital/m2.jpg' },
      { first: 'Mohamed', last: 'Lafly', position: 'Member', linkedin: 'https://www.linkedin.com/in/mohamed-lafly-a45370367', img: 'teams/digital/m3.png' },
      { first: 'Kushan', last: 'Randika Herath', position: 'Member', linkedin: 'https://www.linkedin.com/in/kushan-randika-herath-5a3b39352/', img: 'teams/digital/m4.jpg' },
      { first: 'Madhuka', last: 'Malshan', position: 'Member', linkedin: 'https://www.linkedin.com/in/madhuka-malshan-759119301/', img: 'teams/digital/m5.jpg' },
    ],
  },
  {
    name: 'Proctor Management',
    members: [
      { first: 'Evindu', last: 'Senanayake', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/evindu-eranjan', img: 'teams/proctor/m1.png' },
      { first: 'Ilma', last: 'Habbab', position: 'Co-Lead', linkedin: 'https://www.linkedin.com/in/ilma-h-33a801356/', img: 'teams/proctor/m2.png' },
      { first: 'Nimesh', last: 'Shaminda', position: 'Member', linkedin: 'https://www.linkedin.com/in/nimesh-shaminda', img: 'teams/proctor/m3.png' },
      { first: 'Bihara', last: 'Malith', position: 'Member', linkedin: 'https://www.linkedin.com/in/bihara-malith/', img: 'teams/proctor/m4.png' },
    ],
  },
  {
    name: 'Program',
    members: [
      { first: 'Kenuli', last: 'Bulathsinghela', position: 'Member', linkedin: 'https://www.linkedin.com/in/kenulibulathsinghela', img: 'teams/program/m1.png' },
      { first: 'Thanushi', last: 'Paranagama', position: 'Member', linkedin: 'https://www.linkedin.com/in/thanushi-paranagama', img: 'teams/program/m2.png' },
      { first: 'Nelusha', last: 'Sajaya', position: 'Member', linkedin: 'https://www.linkedin.com/in/nelusha-sajaya', img: 'teams/program/m3.png' },
      { first: 'Udana', last: 'Wickramasuriya', position: 'Member', linkedin: 'https://www.linkedin.com/in/udana-wickramasuriya-612676344', img: 'teams/program/m4.png' },
      { first: 'Mohammed', last: 'Sajid', position: 'Member', linkedin: 'https://www.linkedin.com/in/mohamed-sajid-se', img: 'teams/program/m6.png' },
    ],
  },
  {
    name: 'Marketing',
    members: [
      { first: 'Kaveen', last: 'Ekanayake', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/kaveen-ekanayake-594b18363/', img: 'teams/marketing/m1.jpg' },
      { first: 'Maleesha', last: 'Sathsarani', position: 'Co-Lead', linkedin: 'http://www.linkedin.com/in/maleesha-sathsarani-56b3462a5', img: 'teams/marketing/m2.jpg' },
      { first: 'Ravini', last: 'Wickramarathne', position: 'Member', linkedin: 'https://www.linkedin.com/in/ravini-wickramarathne-6387ba329', img: 'teams/marketing/m3.jpg' },
      { first: 'Fahma', last: 'Farick', position: 'Member', linkedin: 'https://www.linkedin.com/in/fahmafarick/', img: 'teams/marketing/m4.jpg' },
      { first: 'Ashfaq', last: 'Jareed', position: 'Member', linkedin: 'https://www.linkedin.com/in/mohamed-ashfaq-jareed-20070401mh/', img: 'teams/marketing/m5.jpg' },
      { first: 'Dilhara', last: 'Withanage', position: 'Member', linkedin: 'https://linkedin.com/in/dilhara-withanage-90589b2b7', img: 'teams/marketing/m6.jpg' },
      { first: 'Sahan', last: 'Samararathne', position: 'Member', linkedin: 'https://www.linkedin.com/in/sahan-samararathne-73a83533a', img: 'teams/marketing/m7.png' },
      { first: 'Kalana', last: 'Waliyadda', position: 'Member', linkedin: 'https://www.linkedin.com/in/kalana-waliyadda/', img: 'teams/marketing/m8.png' },
      { first: 'Midura', last: 'Navanjana', position: 'Member', linkedin: 'https://www.linkedin.com/in/midura-navanjana-14701837a', img: 'teams/marketing/m9.png' },
      { first: 'Shan', last: 'Gunaratne', position: 'Member', linkedin: 'https://www.linkedin.com/in/shan-gunaratne-6586b433a', img: 'teams/marketing/m10.png' },
      { first: 'Mohammed', last: 'Minhaj', position: 'Member', linkedin: 'https://www.linkedin.com/in/mohamad-minhaj-ba5174368', img: 'teams/marketing/m11.png' },
      { first: 'Kavindi', last: 'Perera', position: 'Member', linkedin: 'https://www.linkedin.com/in/kavindi-tharushika-445576276', img: 'teams/marketing/m12.png' },
      { first: 'Anhaj', last: 'Uwaisulkarni', position: 'Member', linkedin: 'https://www.linkedin.com/in/anhaj-uwaisulkarni-1781a8308', img: 'teams/marketing/m13.png' },
      { first: 'Vabeeshan', last: 'Vasantharajan', position: 'Member', linkedin: 'https://www.linkedin.com/in/vabeeshan-vasantharajan-20530426a/', img: 'teams/marketing/m14.png' },
      { first: 'Navod', last: 'Peiris', position: 'Member', linkedin: 'http://www.linkedin.com/in/navod-peiris-506994203', img: 'teams/marketing/m15.jpg' },
      { first: 'Sakula', last: 'Jayasingha', position: 'Member', linkedin: 'https://www.linkedin.com/in/sakula-jayasingha-298175339', img: 'teams/marketing/m16.jpg' },
      { first: 'Ramidu', last: 'Pigera', position: 'Member', linkedin: 'https://www.linkedin.com/in/ramidu-athauda-049447387', img: 'teams/marketing/m18.jpg' },
      { first: 'Pasindu', last: 'Lakshan', position: 'Member', linkedin: 'https://www.linkedin.com/in/pasindu-jayakody-679937387', img: 'teams/marketing/m19.jpg' },
      { first: 'Kavishanke', last: 'Adithya', position: 'Member', linkedin: 'http://linkedin.com/in/kavishanke-adithya', img: 'teams/marketing/m20.jpg' },
      { first: 'Kavindu', last: 'Madhawa', position: 'Member', linkedin: 'https://www.linkedin.com/in/kavindu-madhawa-b06111311', img: 'teams/marketing/m21.jpg' },
    ],
  },
  {
    name: 'Logistics',
    members: [
      { first: 'Sankha', last: 'Jayawardhana', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/sankha-jayawardhana-b79413262', img: 'teams/logistics/m1.png' },
      { first: 'Kavishka', last: 'Buddhimal', position: 'Co-Lead', linkedin: 'https://www.linkedin.com/in/kavishka-buddhimal-03b620317', img: 'teams/logistics/m2.png' },
      { first: 'Mohammed', last: 'Munshif', position: 'Member', linkedin: 'https://www.linkedin.com/in/mohamed-munshif-a29338261', img: 'teams/logistics/m3.png' },
      { first: 'Ayomi', last: 'Wijesooriya', position: 'Member', linkedin: 'https://www.linkedin.com/in/ayomi-wijesooriya-587a6b226', img: 'teams/logistics/m4.png' },
      { first: 'Chandisa', last: 'Randeni', position: 'Member', linkedin: 'https://www.linkedin.com/in/chandisarandeni/', img: 'teams/logistics/m5.png' },
      { first: 'Himeth', last: 'Hansindu', position: 'Member', linkedin: '#', img: 'teams/logistics/m6.png' },
      { first: 'Evan', last: 'Perera', position: 'Member', linkedin: 'https://www.linkedin.com/in/evan-perera-76b361341', img: 'teams/logistics/m8.JPG' },
    ],
  },
  {
    name: 'Delegates',
    members: [
      { first: 'Dinelli', last: 'Samarakkody', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/dinelli-samarakkody-78a46a321', img: 'teams/delegates/m1.png' },
      { first: 'Linara', last: 'Premawansha', position: 'Co-Lead', linkedin: 'https://www.linkedin.com/in/linara-premawansha', img: 'teams/delegates/m2.png' },
      { first: 'Niragi', last: 'Kodagoda', position: 'Member', linkedin: 'https://www.linkedin.com/in/niragi-kodagoda-8b40b3288', img: 'teams/delegates/m3.png' },
      { first: 'Amod', last: 'Matheesha', position: 'Member', linkedin: 'https://www.linkedin.com/in/amod-matheesha-a1a2a72a6', img: 'teams/delegates/m4.png' },
      { first: 'Amandi', last: 'Wijesinghe', position: 'Member', linkedin: 'https://www.linkedin.com/in/amandi-wijesinghe', img: 'teams/delegates/m5.png' },
      { first: 'Shadeena', last: 'Minoshi', position: 'Member', linkedin: 'https://www.linkedin.com/in/shadeena-minoshi/', img: 'teams/delegates/m6.png' },
      { first: 'Shavishka', last: 'Kuruppu', position: 'Member', linkedin: 'https://www.linkedin.com/in/savishkakuruppu', img: 'teams/delegates/m7.png' },
      { first: 'Tharuki', last: 'Jayawardana', position: 'Member', linkedin: 'https://www.linkedin.com/in/tharuki-jayawardhana-4b99b826a', img: 'teams/delegates/m15.png' },
      { first: 'Deneth', last: 'Kavishka', position: 'Member', linkedin: 'https://www.linkedin.com/in/deneth-kavishka-338288284/', img: 'teams/delegates/m9.png' },
      { first: 'Tharushi', last: 'Sewwandi', position: 'Member', linkedin: 'https://www.linkedin.com/in/d-t-n-sewwandi-b5a7a0313/', img: 'teams/delegates/m10.png' },
      { first: 'Sahan', last: 'Devinda', position: 'Member', linkedin: 'https://www.linkedin.com/in/sahan-devinda-0143bb33b', img: 'teams/delegates/m11.png' },
      { first: 'Sunadi', last: 'Amarasinghe', position: 'Member', linkedin: 'https://www.linkedin.com/in/sunadi-a-ab3ab8249/', img: 'teams/delegates/m12.jpg' },
    ],
  },
  {
    name: 'Finance',
    members: [
      { first: 'Udith', last: 'Konara', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/udithsandaruwan/', img: 'teams/finance/m1.png' },
      { first: 'William', last: 'Dilrukshi', position: 'Co-Lead', linkedin: 'http://www.linkedin.com/in/william-dilrukshi-612182380', img: 'teams/finance/m2.png' },
      { first: 'Pasindu', last: 'Rathnayake', position: 'Member', linkedin: 'https://www.linkedin.com/in/pasindu-l-rathnayaka', img: 'teams/finance/m3.png' },
      { first: 'Tharushi', last: 'Navodi', position: 'Member', linkedin: 'https://www.linkedin.com/in/tharushi-navodi-5b976b284', img: 'teams/finance/m4.png' },
    ],
  },
  {
    name: 'Event Guest Relations',
    members: [
      { first: 'Sithil', last: 'De Silva', position: 'Team Lead', linkedin: 'https://www.linkedin.com/in/sithil-semitha-b668b0228', img: 'teams/eventguest/m1.png' },
      { first: 'Thinadhi', last: 'Rathnaweera', position: 'Co-Lead', linkedin: 'https://www.linkedin.com/in/thinadhi-rathnaweera-656532357/', img: 'teams/eventguest/m2.png' },
      { first: 'Kushani', last: 'Perera', position: 'Member', linkedin: 'https://www.linkedin.com/in/kushani-perera123', img: 'teams/eventguest/m3.png' },
      { first: 'Dulran', last: 'Dunith', position: 'Member', linkedin: 'https://www.linkedin.com/in/dulran-d999/', img: 'teams/eventguest/m4.png' },
    ],
  },
];

export default function Committee() {
  const [activeTeam, setActiveTeam] = useState(0);
  const teamsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(false);

  const startAutoSwitch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveTeam((prev) => (prev + 1) % teamsData.length);
    }, 3000);
  }, []);

  const stopAutoSwitch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  // Pause switching when section is not in viewport or tab is hidden
  useEffect(() => {
    const el = teamsRef.current;
    if (!el) return;

    let inView = false;

    const checkAndToggle = () => {
      const isVisible = inView && document.visibilityState === 'visible';
      isVisibleRef.current = isVisible;
      if (isVisible) {
        startAutoSwitch();
      } else {
        stopAutoSwitch();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        checkAndToggle();
      },
      { rootMargin: '50px' }
    );

    observer.observe(el);

    const handleVisibilityChange = () => {
      checkAndToggle();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAutoSwitch();
    };
  }, [startAutoSwitch, stopAutoSwitch]);

  const handleManualClick = (idx: number) => {
    setActiveTeam(idx);
    stopAutoSwitch();
    pauseTimeoutRef.current = setTimeout(() => {
      if (isVisibleRef.current) {
        startAutoSwitch();
      }
    }, 5000);
  };

  const handleHoverStart = useCallback(() => {
    stopAutoSwitch();
  }, [stopAutoSwitch]);

  const handleHoverEnd = useCallback(() => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      if (isVisibleRef.current) {
        startAutoSwitch();
      }
    }, 1500);
  }, [startAutoSwitch]);

  return (
    <section className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.04),transparent_50%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Organizing Committee (Executive Board) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Leadership
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Organizing <span className="text-gradient-cyan">Committee</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            Guiding the event from start to finish.
          </p>
        </motion.div>

        {/* Student Branch Ambassador */}
        <div className="max-w-sm mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SpotlightCard className="group h-full glass-panel-light clip-slanted overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={getOptimizedCloudinaryUrl(ambassador.image, { width: 500, crop: 'fill', gravity: 'face' })}
                  alt={ambassador.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent"></div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-1 tracking-tight group-hover:text-cyan-300 transition-colors">
                  {ambassador.name}
                </h3>
                <p className="text-xs text-slate-400 font-light mb-3">{ambassador.role}</p>
                <a
                  href={ambassador.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-mono uppercase tracking-wider hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink size={14} strokeWidth={1.5} />
                  LinkedIn
                </a>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Executive Committee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {execBoard.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard className="group h-full glass-panel-light clip-slanted overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getOptimizedCloudinaryUrl(member.image, { width: 500, crop: 'fill', gravity: 'face' })}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white mb-1 tracking-tight group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light mb-3">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-mono uppercase tracking-wider hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink size={14} strokeWidth={1.5} />
                    LinkedIn
                  </a>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Proctor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Dedicated Support
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
            Meet Our <span className="text-gradient-cyan">Proctor</span>
          </h2>
          <p className="text-slate-400 font-light tracking-wide max-w-lg mx-auto mb-12">
            Dedicated to ensuring a smooth event experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-sm mx-auto mb-32"
        >
          <SpotlightCard className="group glass-panel-light clip-slanted overflow-hidden">
            <div className="relative h-72 overflow-hidden">
              <Image
                src={getOptimizedCloudinaryUrl(proctor.image, { width: 500, crop: 'fill', gravity: 'face' })}
                alt={proctor.name}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent"></div>
            </div>
            <div className="p-5 text-center">
              <h3 className="text-base font-bold text-white mb-1 tracking-tight group-hover:text-cyan-300 transition-colors">
                {proctor.name}
              </h3>
              <p className="text-xs text-slate-400 font-light mb-3">{proctor.role}</p>
              <a
                href={proctor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-mono uppercase tracking-wider hover:text-cyan-300 transition-colors"
              >
                <ExternalLink size={14} strokeWidth={1.5} />
                LinkedIn
              </a>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* OC Teams */}
        <div ref={teamsRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
              The Crew
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
              OC <span className="text-gradient-cyan">Teams</span>
            </h2>
            <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
              The dedicated teams that made NIBMCodeX 1.0 possible.
            </p>
          </motion.div>

          {/* Team Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {teamsData.map((team, idx) => (
              <button
                key={idx}
                onClick={() => handleManualClick(idx)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider clip-slanted transition-all duration-300 ${
                  activeTeam === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {team.name}
                <span className="ml-1.5 opacity-50">({team.members.length})</span>
              </button>
            ))}
          </div>

          {/* Team Members Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto justify-items-center">
                {teamsData[activeTeam].members.map((member, idx) => (
                  <motion.div
                    key={`${activeTeam}-${idx}-${member.first}-${member.last}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <SpotlightCard className="group glass-panel-light clip-slanted overflow-hidden h-full">
                      <div className="relative h-28 sm:h-32 overflow-hidden">
                        <div className="absolute inset-0 bg-navy-900" />
                        <Image
                          src={getOptimizedCloudinaryUrl(
                            `https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/${member.img.replace(/\.[^/.]+$/, "")}`,
                            { width: 320, crop: 'fill', gravity: 'face' }
                          )}
                          alt={`${member.first} ${member.last}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent"></div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                          {member.first} {member.last}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wide mt-0.5">
                          {member.position}
                        </p>
                        {member.linkedin !== '#' && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400/60 hover:text-cyan-300 transition-colors mt-1"
                          >
                            <ExternalLink size={10} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
