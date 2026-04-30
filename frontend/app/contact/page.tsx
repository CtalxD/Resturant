'use client';
import { useState } from 'react';
import styles from './contact.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaCrown,
  FaUtensils,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaCommentDots,
  FaCalendarAlt,
  FaUsers,
  FaStar
} from 'react-icons/fa';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const navigateToMenu = () => {
    router.push('/menu');
  };

  const subjects = [
    "General Inquiry",
    "Reservation",
    "Private Event",
    "Catering",
    "Feedback",
    "Partnership",
    "Other"
  ];

  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <FaCrown className={styles.logoIcon} />
            <div>
              <span className={styles.logoText}>KINGS</span>
              <span className={styles.logoSubtext}>EATERY</span>
            </div>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/menu">Menu</Link>
            <Link href="/about">About</Link>
            <Link href="/location">Location</Link>
            <Link href="/contact" className={styles.activeLink}>Contact</Link>
          </div>
          <button className={styles.reserveBtn} onClick={navigateToMenu}>
            <FaUtensils style={{marginRight: '8px'}} /> Order Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FaEnvelope className={styles.badgeIcon} />
            <span>Get In Touch</span>
          </div>
          <h1 className={styles.heroTitle}>
            Let&apos;s <span className={styles.goldText}>Talk</span><br />
            We&apos;re <span className={styles.goldText}>Listening</span>
          </h1>
          <p className={styles.heroDescription}>
            Have a question, feedback, or want to plan something special? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.formContainer}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Send a Message</span>
                <h2 className={styles.sectionTitle}>We&apos;d Love to Help</h2>
              </div>

              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIconWrapper}>
                    <FaCheckCircle className={styles.successIcon} />
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <button 
                    className={styles.sendAnotherBtn}
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">
                        <FaUser className={styles.inputIcon} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        <FaEnvelope className={styles.inputIcon} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">
                        <FaPhone className={styles.inputIcon} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="subject">
                        <FaCommentDots className={styles.inputIcon} />
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label htmlFor="message">
                      <FaCommentDots className={styles.inputIcon} />
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className={styles.spinner} /> Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Cards */}
            <div className={styles.infoContainer}>
              <div className={styles.quickContact}>
                <h3 className={styles.quickContactTitle}>Quick Contact</h3>
                <div className={styles.quickContactGrid}>
                  <a href="tel:+9779801234567" className={styles.quickContactCard}>
                    <div className={styles.quickContactIcon}>
                      <FaPhone />
                    </div>
                    <div className={styles.quickContactInfo}>
                      <span className={styles.quickContactLabel}>Call Us</span>
                      <span className={styles.quickContactValue}>+977 9801234567</span>
                    </div>
                  </a>
                  <a href="mailto:hello@kingseatery.com" className={styles.quickContactCard}>
                    <div className={styles.quickContactIcon}>
                      <FaEnvelope />
                    </div>
                    <div className={styles.quickContactInfo}>
                      <span className={styles.quickContactLabel}>Email Us</span>
                      <span className={styles.quickContactValue}>hello@kingseatery.com</span>
                    </div>
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Sanepa+Chowk+Lalitpur+Kathmandu+Nepal" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.quickContactCard}
                  >
                    <div className={styles.quickContactIcon}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className={styles.quickContactInfo}>
                      <span className={styles.quickContactLabel}>Visit Us</span>
                      <span className={styles.quickContactValue}>Sanepa, Lalitpur</span>
                    </div>
                  </a>
                  <div className={styles.quickContactCard}>
                    <div className={styles.quickContactIcon}>
                      <FaClock />
                    </div>
                    <div className={styles.quickContactInfo}>
                      <span className={styles.quickContactLabel}>Working Hours</span>
                      <span className={styles.quickContactValue}>10 AM - 9 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.businessInquiries}>
                <h3 className={styles.businessTitle}>Business Inquiries</h3>
                <p className={styles.businessText}>
                  For partnerships, events, and catering inquiries, please reach out to our dedicated team.
                </p>
                <div className={styles.businessContact}>
                  <div className={styles.businessRow}>
                    <FaUser className={styles.businessIcon} />
                    <div>
                      <span className={styles.businessLabel}>Events & Catering</span>
                      <span className={styles.businessValue}>events@kingseatery.com</span>
                    </div>
                  </div>
                  <div className={styles.businessRow}>
                    <FaUsers className={styles.businessIcon} />
                    <div>
                      <span className={styles.businessLabel}>Partnerships</span>
                      <span className={styles.businessValue}>partners@kingseatery.com</span>
                    </div>
                  </div>
                  <div className={styles.businessRow}>
                    <FaStar className={styles.businessIcon} />
                    <div>
                      <span className={styles.businessLabel}>Feedback</span>
                      <span className={styles.businessValue}>feedback@kingseatery.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.socialConnect}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <div className={styles.socialLinksLarge}>
                  <a href="#" className={styles.socialLinkLarge}>
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>
                  <a href="#" className={styles.socialLinkLarge}>
                    <FaFacebook />
                    <span>Facebook</span>
                  </a>
                  <a href="#" className={styles.socialLinkLarge}>
                    <FaTwitter />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <FaCrown className={styles.logoIcon} />
                <span className={styles.footerLogoText}>kings</span>
              </div>
              <p className={styles.footerDescription}>
                Craft burgers and brunch in the heart of Sanepa, Lalitpur. Where quality meets comfort.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}><FaInstagram /></a>
                <a href="#" className={styles.socialLink}><FaFacebook /></a>
                <a href="#" className={styles.socialLink}><FaTwitter /></a>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <h4>Quick Links</h4>
              <Link href="/menu">Menu</Link>
              <Link href="/about">Our Story</Link>
              <Link href="/location">Find Us</Link>
              <Link href="/menu">Order Online</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Hours</h4>
              <p>Monday - Sunday</p>
              <p>10:00 AM - 9:00 PM</p>
              <p className={styles.footerNote}>Kitchen closes at 8:30 PM</p>
            </div>
            <div className={styles.footerNewsletter}>
              <h4>Stay Updated</h4>
              <p>Get exclusive deals and new menu alerts</p>
              <div className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className={styles.newsletterInput}
                />
                <button className={styles.newsletterBtn}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Kings Eatery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}