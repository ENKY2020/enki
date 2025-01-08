/* Services Page */
import React from "react";
import "../styles/services.css"; // Import the CSS file for styling

const Services = () => {
  return (
    <div className="services-page">
      <h1 className="services-title">Our Services</h1>
      <div className="services-container">
        <div className="service-box">
          <h2>Professional Services</h2>
          <p>Quality services at competitive rates</p>
          <div className="service-details">
            <ul>
              <li>Professional CV Typesetting: KSh 350</li>
              <li>International CV Typesetting: KSh 500</li>
              <li>Portfolio Creation: KSh 1500</li>
              <li>Cover Letters: KSh 150</li>
              <li>Recommendation Letters: KSh 200</li>
              <li>CV Revamps: KSh 100</li>
            </ul>
          </div>
          <a href="https://wa.me/254768063078" className="whatsapp-btn">
            Inquire via WhatsApp
          </a>
        </div>

        <div className="service-box">
          <h2>Government Services</h2>
          <p>E-Citizen & KRA Services</p>
          <div className="service-details">
            <ul>
              <li>Police Clearance Certificate</li>
              <li>Driving License Application</li>
              <li>SHA Services</li>
              <li>NSSF Services</li>
              <li>KRA Services</li>
            </ul>
          </div>
          <a href="https://wa.me/254768063078" className="whatsapp-btn">
            Inquire via WhatsApp
          </a>
        </div>

        <div className="service-box">
          <h2>Academic & Business</h2>
          <p>Research Projects & Business Plans</p>
          <div className="service-details">
            <ul>
              <li>Academic Research Projects: KSh 3500</li>
              <li>Business Plans: KSh 2500</li>
              <li>Report Writing: KSh 1500</li>
            </ul>
          </div>
          <a href="https://wa.me/254768063078" className="whatsapp-btn">
            Inquire via WhatsApp
          </a>
        </div>

        <div className="service-box">
          <h2>Travel Services</h2>
          <p>Visa & Green Card Applications</p>
          <div className="service-details">
            <ul>
              <li>Green Card DV Lottery (Single): KSh 400</li>
              <li>Green Card DV Lottery (Family): KSh 500</li>
              <li>USA Visit Visa Application: KSh 1500</li>
              <li>Kenyan Visa Passport: KSh 700</li>
            </ul>
          </div>
          <a href="https://wa.me/254768063078" className="whatsapp-btn">
            Inquire via WhatsApp
          </a>
        </div>

        <div className="service-box">
          <h2>Web Development</h2>
          <p>Website Packages</p>
          <div className="service-details">
            <ul>
              <li>Static Website (1-5 pages): KSh 5,000 - KSh 20,000</li>
              <li>Landing Page: KSh 10,000 - KSh 20,000</li>
              <li>Small Business Website (several pages): KSh 20,000 - KSh 30,000</li>
              <li>E-commerce Website (1-30 products): KSh 25,000 - KSh 50,000</li>
              <li>Corporate Website (advanced functionality): KSh 45,000 - KSh 90,000</li>
              <li>Custom E-commerce Website: KSh 250,000+</li>
              <li>Ongoing Maintenance: KSh 2,000 - KSh 6,000 per year</li>
            </ul>
          </div>
          <a href="https://wa.me/254768063078" className="whatsapp-btn">
            Inquire via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
