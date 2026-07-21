import React, { useState, useRef, useEffect } from 'react';
import './Hero.css';
import Vedio4 from '../../assets/images/Vedio4.mp4';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">          

          <h1 className="hero-title">
            Need a trusted  <span className="highlight">fundi </span>today?
          </h1>
          
          <p className="hero-description">
       We connect homes, properties and businesses with trusted technicians for electrical, plumbing, 
       appliance repair, CCTV, internet installation, and general maintenance services
          </p>

        </div>

        <div className="hero-illustration">
          <div className="hero-video-container" onClick={handleVideoClick}>
            <video
              ref={videoRef}
              className="hero-video"
              loop
              muted
              playsInline
              poster={Vedio4}
            >
              <source src={Vedio4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={`video-overlay ${isPlaying ? 'hidden' : ''}`}>
              <div className="play-button">▶</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;