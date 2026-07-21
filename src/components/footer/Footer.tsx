import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Brand Column */}
        <div className="footer-brand animate-fade-in">
          <div className="logo">
            {/* SVG Graphic matches the house/tech theme from image_c528ea.png */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 12H5V22H19V12H22L12 2Z" fill="#ff5722"/>
              <path d="M9 14H15V20H9V14Z" fill="#0b111e"/>
            </svg>
            <div className="logo-text">myFundi <span>Hub</span></div>
          </div>
          <p className="description">
            Kenya's home services platform — connecting homeowners and businesses with verified technicians.
          </p>
          
          <div className="contact-info">
            <a href="mailto:myfundihub@gmail.com" className="contact-item">
              <div className="icon-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              myfundihub@gmail.com
            </a>
            <a href="tel:+254799160014" className="contact-item">
              <div className="icon-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              +254 799 160 014
            </a>
            <a href="tel:+254700917222" className="contact-item">
              <div className="icon-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              +254 700 917 222
            </a>
            <div className="contact-item">
              <div className="icon-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              Nairobi, Kenya
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#book">Book a service</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#technicians">For technicians</a></li>
            <li><a href="#register">Register</a></li>
            <li><a href="#login">Log in</a></li>
          </ul>
        </div>

        {/* Services Column */}
        <div className="footer-links-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#electrical">Electrical & Electronics</a></li>
            <li><a href="#plumbing">Plumbing</a></li>
            <li><a href="#carpentry">Carpentry</a></li>
            <li><a href="#interior-design">Interior Design</a></li>
            <li><a href="#appliance-repair">Appliance Repair</a></li>
            <li><a href="#cctv-installation">CCTV Installation</a></li>
            <li><a href="#other">Other services</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-links-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#contact">Contact us</a></li>
            <li><a href="#help">Help Centre</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2026 myFundi Hub. All rights reserved.
        </div>
        <div className="made-in-badge-container">
          <div className="made-in-badge">
            <span className="country-code">KE</span> Made in Kenya
          </div>
        </div>
        <div className="bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;