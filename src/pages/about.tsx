import React from 'react';
import { motion } from 'framer-motion';


const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const paragraphs = [
    "New York Curated was born out of our desire to find great places.",
    "But we were tired of the inefficiency: the endless scrolling, the infinite feeds.",
    "The saved social media posts. The bookmarks. The typed-out lists in our Notes app.",
    "In an era of platforms competing relentlessly for our attention, our black background is an invitation to relax your eyes for a second.",
    "To breathe.",
    "Then, we ask you the question: what are you looking for? What do you want?",
    "Last, we present our recommendations. Nothing more, nothing less."
  ];




  return (
    <div className="about-container">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="about-content"
      >
        <motion.h1 
          className="about-title"
          {...fadeInUp}
        >
          About the Project, About Us
        </motion.h1>

        <div>
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              className="about-paragraph"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;