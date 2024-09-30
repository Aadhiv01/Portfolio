import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const timelineEvents = [
  {
    date: '2020',
    title: 'Started Coding Journey',
    description: 'Began learning programming with Python and web development basics.',
    icon: '🚀',
  },
  {
    date: '2021',
    title: 'First Internship',
    description: 'Secured an internship at a local tech startup, working on frontend development.',
    icon: '💼',
  },
  {
    date: '2022',
    title: 'Graduated University',
    description: 'Completed Bachelor\'s degree in Computer Science with honors.',
    icon: '🎓',
  },
  {
    date: '2022',
    title: 'First Full-time Role',
    description: 'Joined a mid-sized software company as a Junior Full-Stack Developer.',
    icon: '💻',
  },
  {
    date: '2023',
    title: 'Led First Project',
    description: 'Successfully managed and delivered a critical client project ahead of schedule.',
    icon: '📊',
  },
  {
    date: '2024',
    title: 'Promoted to Senior Developer',
    description: 'Recognized for technical expertise and leadership skills with a promotion.',
    icon: '🏆',
  },
];

const TimelineEvent = ({ event, index, progress }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const eventProgress = useTransform(progress, [0, 1], [index / timelineEvents.length, (index + 1) / timelineEvents.length]);
  const scale = useTransform(eventProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(eventProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      className={`timeline-event my-16 ${index % 2 === 0 ? 'mr-auto pr-8 md:pr-16' : 'ml-auto pl-8 md:pl-16'}`}
      initial="hidden"
      animate={controls}
      variants={variants}
      style={{ scale, opacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="event-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden"
        whileHover={{ y: -5 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-4">{event.icon}</span>
          <div>
            <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.date}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-200">{event.description}</p>
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>
    </motion.div>
  );
};

const InteractiveTimeline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const unsubscribe = smoothProgress.onChange(v => {
      const index = Math.min(
        timelineEvents.length - 1,
        Math.floor(v * timelineEvents.length)
      );
      setCurrentIndex(index);
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  const scrollToNextEvent = () => {
    const nextIndex = Math.min(currentIndex + 1, timelineEvents.length - 1);
    const element = document.querySelector(`.timeline-event:nth-child(${nextIndex + 1})`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative py-20 px-4 md:px-0 max-w-4xl mx-auto" ref={containerRef}>
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 transform -translate-x-1/2"></div>
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 origin-top transform -translate-x-1/2"
        style={{ scaleY: smoothProgress }}
      ></motion.div>
      <div className="relative z-10">
        {timelineEvents.map((event, index) => (
          <TimelineEvent
            key={index}
            event={event}
            index={index}
            progress={smoothProgress}
          />
        ))}
      </div>
      <motion.div
        className="sticky top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer"
        style={{
          scale: useTransform(smoothProgress, [0, 1], [0.5, 1.5]),
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToNextEvent}
      >
        <ChevronDown className="text-white" size={20} />
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;