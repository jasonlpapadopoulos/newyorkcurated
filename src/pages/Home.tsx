import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number): void => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const faqs = [
    {
      question: 'Are you just another city guide?',
      answer: 'We like to believe that we are different, as other guides focus on exploration, not curation. We help you find very narrowly what you are looking for, while at the same time giving you relevant recommendations.',
    },
    {
      question: 'Why are your options so limited?',
      answer: 'We focus on places that are worth going, according to a few standards. All of our recommendations are hand-picked, and we never receive compensation for including (or excluding, for that matter) a place.',
    },
    {
      question: 'Why should I trust your recommendations?',
      answer: 'Of course, no matter how much we try to convince you, it is ultimtately up to you to decide. Do this test: if you know an area well, check out our recommendations in it. See if you agree or disagree.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>New York Curated</title>
        <meta name="description" content="The best things to do in New York." />
      </Helmet>
      <div className="hero">
        <div className="hero-content">
          <h1 className="big-title">New York Curated</h1>
          <p className="subtitle">The best things to do in New York.</p>
          <p className="comment">Handpicked, like upstate apples.</p>
          <Link to="/what-are-you-looking-for" className="explore-button">
            Explore
          </Link>
        </div>
      </div>
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;