import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HowItWorks.css';
import match from '../../assets/images/match.png';
import post1 from '../../assets/images/post1.jpeg';
import Lipa from '../../assets/images/lipa.png';

const steps = [
  {
    id: 'choose-service',
    number: '01',
    label: 'Discover services',
    title: 'Choose a Service',
    description:
      'Browse trusted categories and pick the exact support your home or business needs.',
    accent: 'accent-orange',
    image: post1,
  },
  {
    id: 'share-location',
    number: '02',
    label: 'Find nearby fundis',
    title: 'Share Your Location',
    description:
      'Enter your address or use GPS so verified experts near you can be matched quickly.',
    accent: 'accent-blue',
    image: match,
  },
  {
    id: 'pay-and-match',
    number: '03',
    label: 'Secure your booking',
    title: 'Pay Call-out Rate & Get Matched',
    description:
      'Settle the 1000 KSH consultation fee, get matched instantly, and let your technician head your way.',
    accent: 'accent-teal',
    image: Lipa,
  },
  {
    id: 'job-complete',
    number: '04',
    label: 'Finish with confidence',
    title: 'Job Completed',
    description:
      'The job is completed, payment is secured, and you can leave a review for next time.',
    accent: 'accent-emerald',

  },
];

const StepIllustration: React.FC<{ accent: string; title: string }> = ({ accent, title }) => {
  const commonProps = {
    viewBox: '0 0 120 120',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  if (title === 'Choose a Service') {
    return (
      <svg {...commonProps} className={`step-illustration-svg ${accent}`} aria-hidden="true">
        <rect x="24" y="24" width="72" height="72" rx="20" className="illustration-surface" />
        <rect x="36" y="42" width="48" height="10" rx="5" className="illustration-line" />
        <rect x="36" y="58" width="34" height="10" rx="5" className="illustration-line" />
        <rect x="36" y="74" width="22" height="10" rx="5" className="illustration-line" />
      </svg>
    );
  }

  if (title === 'Share Your Location') {
    return (
      <svg {...commonProps} className={`step-illustration-svg ${accent}`} aria-hidden="true">
        <circle cx="60" cy="60" r="32" className="illustration-surface" />
        <path d="M60 34C52 45 44 55 44 63C44 72 51 82 60 82C69 82 76 72 76 63C76 55 68 45 60 34Z" className="illustration-line" />
        <circle cx="60" cy="60" r="8" className="illustration-accent" />
      </svg>
    );
  }

  if (title === 'Pay Call-out Rate & Get Matched') {
    return (
      <svg {...commonProps} className={`step-illustration-svg ${accent}`} aria-hidden="true">
        <rect x="28" y="30" width="64" height="60" rx="18" className="illustration-surface" />
        <rect x="44" y="44" width="18" height="18" rx="4" className="illustration-accent" />
        <path d="M66 44H76" className="illustration-line" />
        <path d="M66 54H74" className="illustration-line" />
        <path d="M66 64H72" className="illustration-line" />
      </svg>
    );
  }

  return (
    <svg {...commonProps} className={`step-illustration-svg ${accent}`} aria-hidden="true">
      <circle cx="60" cy="60" r="34" className="illustration-surface" />
      <path d="M46 60L56 70L76 46" className="illustration-accent" />
      <circle cx="60" cy="60" r="8" className="illustration-line" />
    </svg>
  );
};

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();

    const cards = Array.from(document.querySelectorAll<HTMLElement>('.step-card'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-step-id');
          if (entry.isIntersecting && id) {
            setVisibleSteps((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }
        });
      },
      { threshold: 0.18 },
    );

    cards.forEach((card) => observer.observe(card));

    if (mediaQuery.matches) {
      setVisibleSteps(steps.map((step) => step.id));
    }

    return () => observer.disconnect();
  }, []);

  const handleBookService = () => {
    navigate('/login');
  };

  const handleBrowseServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="hiw-glow hiw-glow-one" aria-hidden="true" />
      <div className="hiw-glow hiw-glow-two" aria-hidden="true" />

      <div className="hiw-container">
        <header className="hiw-header">
          <span className="hiw-kicker">Premium booking experience</span>
          <h2 id="how-it-works-title" className="hiw-title">
            How myFundi Works
          </h2>
          <p className="hiw-subtitle">
            Customers can book trusted technicians in four simple steps.
          </p>
        </header>

        <div className="steps-grid" role="list">
          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(step.id);
            const animationDelay = prefersReducedMotion ? undefined : `${index * 120}ms`;

            return (
              <article
                key={step.id}
                data-step-id={step.id}
                className={`step-card ${step.accent} ${isVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: animationDelay }}
                role="listitem"
              >
                <div className="step-card__header">
                  <span className="step-number">{step.number}</span>
                  <span className="step-label">{step.label}</span>
                </div>

                <div className="step-illustration" aria-hidden="true">
                  {step.image ? (
                    <img src={step.image} alt={step.title} className="step-card__image" />
                  ) : (
                    <StepIllustration accent={step.accent} title={step.title} />
                  )}
                </div>

                <div className="step-card__content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hiw-cta" role="presentation">
          <div className="hiw-cta__content">
            <p className="hiw-cta__eyebrow">Ready when you are</p>
            <h3 className="hiw-cta__title">Book a trusted fundi in minutes.</h3>
            <p className="hiw-cta__description">
              From quick fixes to full installations, myFundi Hub connects you with verified experts at the right time.
            </p>
          </div>

          <div className="hiw-cta__actions">
            <button className="btn cta-button cta-button--primary" type="button" onClick={handleBookService}>
              Book a Service
            </button>
            <button className="btn cta-button cta-button--secondary" type="button" onClick={handleBrowseServices}>
              Browse Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;