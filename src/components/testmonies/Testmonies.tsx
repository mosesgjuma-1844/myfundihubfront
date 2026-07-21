import React, { useState, useEffect, useRef } from 'react';
import './Testmonies.css';

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "The M-Pesa integration is a game changer. No carrying cash, no awkward negotiations — you see the price, the work gets done, and you pay. Simple.",
      name: "Faith Njeri",
      title: "Business Owner, Nairobi"
    },
    {
      id: 2,
      rating: 3,
      text: "The service was good overall, but there was a slight delay in the technician arriving. Still, the work was done well.",
      name: "David Kimani",
      title: "Customer, Nairobi"
    },
    {
      id: 3,
      rating: 4,
      text: "I was pleased with the service though the technician was a bit late. The platform is user-friendly and the quality of work was satisfactory.",
      name: "Grace Achieng",
      title: "Customer, Nairobi"
    },
    {
      id: 4,
      rating: 5,
      text: "I had a plumbing emergency at 7 am and within 20 minutes a technician was at my door. The whole process — booking, tracking, and paying — was completely seamless.",
      name: "Amina Wanjiku",
      title: "Homeowner, Nairobi"
    },
    {
      id: 5,
      rating: 4,
      text: "Managing repairs used to be a nightmare. I was able to get the problem fixed quickly and the work was done efficiently. The service was excellent.",
      name: "James Otieno",
      title: "Property Manager"
    },
    {
      id: 6,
      rating: 5,
      text: "I've used myFundi Hub three times now and every experience has been perfect. The technicians are professional and the platform is incredibly easy to use.",
      name: "Sarah Mwangi",
      title: "Homeowner, Nairobi"
    },
    {
      id: 7,
      rating: 4,
      text: "Great service! The technician arrived on time and fixed my washing machine quickly. The M-Pesa payment option made everything so convenient.",
      name: "Peter Ochieng",
      title: "Customer, Nairobi"
    },
    {
      id: 8,
      rating: 5,
      text: "Finally, a reliable platform for home services in Kenya. The technicians are vetted and the quality of work is consistently excellent.",
      name: "Mary Akinyi",
      title: "Property Owner, Nairobi"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollSpeed = 0.5;

    const autoScroll = () => {
      if (!isPaused && !isDragging) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    autoScroll();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleCardClick = () => {
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-badge">TESTIMONIALS</span>
          <h2 className="testimonials-title">What customers are saying</h2>
        </div>

        <div 
          className="testimonials-scroll"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="testimonials-track">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card"
                onClick={handleCardClick}
              >
                <div className="card-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="card-text">{testimonial.text}</p>
                <div className="card-author">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <span className="author-title">{testimonial.title}</span>
                </div>
              </div>
            ))}
            {testimonials.map((testimonial) => (
              <div 
                key={`duplicate-${testimonial.id}`} 
                className="testimonial-card"
                onClick={handleCardClick}
              >
                <div className="card-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="card-text">{testimonial.text}</p>
                <div className="card-author">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <span className="author-title">{testimonial.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-controls">
          <div className="scroll-indicator">
            <span className="indicator-dot active"></span>
            <span className="indicator-dot"></span>
            <span className="indicator-dot"></span>
          </div>
          <p className="scroll-hint">Click or drag to pause scrolling</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;