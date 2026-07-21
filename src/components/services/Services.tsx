import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Image4 from '../../assets/images/Image4.png';
import Design from '../../assets/images/design.png';
import CarpentryImage from '../../assets/images/CarpentryImage.jpeg';
import InstallationImage from '../../assets/images/InstallationImage.png';
import PlumbingImage from '../../assets/images/plumber.png';

const Services: React.FC = () => {
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const navigate = useNavigate();

  const services = [
    {
      id: 'installation-services',
      image: InstallationImage,
      category: 'Installation',
      title: 'Home Installation',
      description: 'Reliable installation for fixtures, appliances, CCTV, fans, solar setups and chandeliers.',
      fullDescription: 'Get professional installation services for home fixtures and appliances, including CCTV systems, ceiling fans, lighting fixtures, and more. Our skilled technicians ensure a seamless and efficient installation process.',
      features: ['Certified installers', 'Flexible scheduling', 'Transparent quotes'],
    },
    {
      id: 'electrical',
      image: Image4,
      category: 'Electrical',
      title: 'Electrical & Electronics',
      description: 'Trusted support for wiring, repairs, installations and maintenance for homes and businesses.',
      fullDescription: 'Complete electrical solutions including wiring installation, socket repairs, lighting fixtures, and ceiling fan installations.',
      features: ['Same-day availability', 'Safety-first service', 'Verified professionals'],
    },
    {
      id: 'plumbing',
      image: PlumbingImage,
      category: 'Plumbing',
      title: 'Plumbing Installation & Repair',
      description: 'Pipes, drains, taps, bathrooms, washers and water heater support.',
      fullDescription: 'Professional plumbing services including pipe repairs, drain unblocking, tap installation, bathroom fittings, and water heater maintenance.',
      features: ['Leak detection', 'Quick response', 'Clean finish'],
    },
    {
      id: 'carpentry',
      image: CarpentryImage,
      category: 'Carpentry',
      title: 'Carpentry Services',
      description: 'Furniture assembly, repairs and custom woodwork for a polished finish.',
      fullDescription: 'Expert carpentry services for furniture assembly, repairs, and custom woodwork projects to enhance your home’s aesthetics.',
      features: ['Custom builds', 'On-site support', 'Premium finishes'],
    },
    {
      id: 'interior-design',
      image: Design,
      category: 'Design',
      title: 'Interior Design',
      description: 'Thoughtful design support to transform spaces into functional, stylish areas.',
      fullDescription: 'Whether you are renovating, furnishing a new property, or refreshing an existing space, our verified interior design professionals offer expert services including space planning, color consultation, furniture selection, lighting design, décor styling, and project coordination.',
      features: ['Space planning', 'Tailored styling', 'Project coordination'],
    },
  ];

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.service-card'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-card-id');
          if (entry.isIntersecting && id) {
            setRevealedCards((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }
        });
      },
      { threshold: 0.15 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleBookService = () => {
    console.log('cta clicked - Services');
    navigate('/login');
  };

  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-header">
          <span className="services-kicker">Premium marketplace</span>
          <div className="services-accent-line" aria-hidden="true" />
          <h2 className="services-title">Services for Every Home & Business</h2>
          <p className="services-description">
            Book trusted professionals for repairs, installations and maintenance—all in one place.
          </p>
          <p className="services-hint">Trusted fundis. Clear pricing. Fast booking.</p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const isVisible = revealedCards.includes(service.id);

            return (
              <article
                key={service.id}
                data-card-id={service.id}
                className={`service-card ${isVisible ? 'is-visible' : ''}`}
              >
                <div className="service-image-wrapper">
                  <img src={service.image} alt={service.title} className="service-image" />
                  <span className="service-badge">{service.category}</span>
                </div>

                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>                  
                  <ul className="service-features" aria-label={`${service.title} features`}>
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <FiCheckCircle className="feature-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="full-description">{service.description}</p>

                  <div className="service-meta">
                    <button className="btn service-cta" type="button" onClick={handleBookService}>
                      Book Service <FiArrowRight />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="services-cta">
          <div className="services-cta__content">
            <p className="services-cta__eyebrow">Need something more specific?</p>
            <h3 className="services-cta__title">Can't find the service you need?</h3>
            <p className="services-cta__description">
              Our network of verified fundis offers many more specialized services.
            </p>
          </div>
          <button className="btn services-cta__button" type="button">
            Request Custom Service
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;