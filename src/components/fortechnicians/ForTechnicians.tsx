import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForTechnicians.css';
import Video1 from '../../assets/images/Vedio1.mp4';

const ForTechnicians: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const handleApply = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
    <section className="for-technicians" id="technicians">
      <div className="technicians-overlay"></div>
      <div className="technicians-container">
        <div className="technicians-content">
          <h1 className="technicians-title">
            Earn with your <span className="highlight">skills</span>
          </h1>
          
          <p className="technicians-description">
            Join hundreds of technicians already earning on myFundi Hub. 
            Set your own hours, accept jobs near you, and get paid instantly via M-Pesa.
          </p>

          <div className="technicians-actions">
            <button className="btn-apply" onClick={handleApply}>Apply as a technician →</button>
            <div className="login-link">
              Already registered? <button className="login-btn" onClick={handleLogin}>Log in</button>
            </div>
          </div>

          <div className="technicians-contact">
            <span className="contact-label">Questions?</span>
            <a href="mailto:myfundihub@gmail.com" className="contact-email">
              myfundihub@gmail.com
            </a>
            <span className="contact-divider">·</span>
            <a href="tel:+254799160014" className="contact-phone">
              +254 799 160 014
            </a>
          </div>
        </div>

        <div className="technicians-illustration">
          <div className="technicians-video-container" onClick={handleVideoClick}>
            <video
              ref={videoRef}
              className="technicians-video"
              loop
              muted
              playsInline
            >
              <source src={Video1} type="video/mp4" />
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

export default ForTechnicians;