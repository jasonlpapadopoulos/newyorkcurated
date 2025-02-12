import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AboutPage = () => {
  const paragraphs = [
    "New York Curated was born out of our desire to find great places.",
    "But also, out of our frustration with going through articles, saved social media posts, map searches, and buried notes.",
    "In an era of platforms competing relentlessly for our attention, our black background is an invitation to pause.",
    "To breathe.",
    "Our one question is simple:",
    "What are you looking for?"
  ];

  const [displayText, setDisplayText] = useState(paragraphs.map(() => ""));
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);  // Track when typing is complete

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) {
      setTypingComplete(true);  // Mark typing as complete when all paragraphs are done
      return;
    }

    if (currentChar < paragraphs[currentParagraph].length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => {
          const newText = [...prev];
          newText[currentParagraph] = paragraphs[currentParagraph].slice(0, currentChar + 1);
          return newText;
        });
        setCurrentChar(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentParagraph(prev => prev + 1);
        setCurrentChar(0);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentParagraph, currentChar]);

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About the Project, About Us</h1>
        <div className="paragraphs-container">
          {displayText.map((text, index) => (
            <p
              key={index}
              className="about-paragraph"
              style={{
                borderRight: index === currentParagraph && currentChar < paragraphs[index].length
                  ? '2px solid white'
                  : 'none'
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Button appears when typing is complete */}
        {typingComplete && (
          <div className="button-container">
          <Link href="/what-are-you-looking-for" className="explore-button">
            Explore
          </Link>
        </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
