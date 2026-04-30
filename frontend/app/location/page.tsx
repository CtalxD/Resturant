'use client';
import styles from './location.module.css';
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
  FaCar,
  FaMotorcycle,
  FaWalking,
  FaBus,
  FaBuilding,
  FaLandmark,
  FaCoffee,
  FaStar,
  FaDirections,
  FaParking,
  FaWifi,
  FaMusic,
  FaArrowRight,
  FaChevronRight,
  FaCheckCircle
} from 'react-icons/fa';

export default function LocationPage() {
  const router = useRouter();

  const nearbyLandmarks = [
    { icon: FaLandmark, name: "Sanepa Chowk", distance: "2 min walk", description: "Main intersection of Sanepa" },
    { icon: FaBuilding, name: "KIST College", distance: "5 min walk", description: "Popular college in the area" },
    { icon: FaCoffee, name: "Himalayan Java", distance: "3 min walk", description: "Popular coffee chain" },
    { icon: FaLandmark, name: "Sanepa Height", distance: "7 min walk", description: "Residential area landmark" }
  ];

  const transportOptions = [
    { icon: FaCar, title: "By Car", description: "5 minutes from Balkhu Chowk, 10 minutes from Kalimati. Plenty of street parking available." },
    { icon: FaMotorcycle, title: "By Bike", description: "Easy access via Ring Road. Dedicated bike parking right outside our entrance." },
    { icon: FaBus, title: "By Bus", description: "Multiple bus routes stop at Sanepa Chowk. Just a 2-minute walk from the bus stop." },
    { icon: FaWalking, title: "By Foot", description: "Walking distance from Sanepa Height and surrounding residential areas." }
  ];

  const amenities = [
    { icon: FaParking, title: "Parking", description: "Free parking available for all guests" },
    { icon: FaWifi, title: "Free WiFi", description: "High-speed internet for all diners" },
    { icon: FaMusic, title: "Ambient Music", description: "Curated playlist for the perfect vibe" },
    { icon: FaCheckCircle, title: "Outdoor Seating", description: "Beautiful terrace seating available" }
  ];

  const navigateToMenu = () => {
    router.push('/menu');
  };

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
            <Link href="/location" className={styles.activeLink}>Location</Link>
            <Link href="/contact">Contact</Link>
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
            <FaMapMarkerAlt className={styles.badgeIcon} />
            <span>Sanepa, Lalitpur</span>
          </div>
          <h1 className={styles.heroTitle}>
            Find <span className={styles.goldText}>Your Way</span><br />
            to Great <span className={styles.goldText}>Food</span>
          </h1>
          <p className={styles.heroDescription}>
            Located in the heart of Sanepa, we&apos;re easy to find and impossible to forget.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapGrid}>
            <div className={styles.mapContainer}>
              <div className={styles.mapWrapper}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1191276498515!2d85.29674147536932!3d27.68280007619727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b2b91b78e!2sSanepa%2C%20Lalitpur%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kings Eatery Location - Sanepa, Lalitpur"
                />
              </div>
            </div>
            <div className={styles.mapInfo}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Our Location</span>
                <h2 className={styles.sectionTitle}>Come Visit Us</h2>
              </div>
              <div className={styles.addressCard}>
                <div className={styles.addressRow}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div>
                    <h4>Address</h4>
                    <p>Sanepa Chowk, Lalitpur</p>
                    <p>Kathmandu 44600, Nepal</p>
                  </div>
                </div>
                <div className={styles.addressDivider} />
                <div className={styles.addressRow}>
                  <FaClock className={styles.addressIcon} />
                  <div>
                    <h4>Operating Hours</h4>
                    <p>Monday - Sunday</p>
                    <p>10:00 AM - 9:00 PM</p>
                    <span className={styles.kitchenNote}>Kitchen closes at 8:30 PM</span>
                  </div>
                </div>
                <div className={styles.addressDivider} />
                <div className={styles.addressRow}>
                  <FaPhone className={styles.addressIcon} />
                  <div>
                    <h4>Contact</h4>
                    <p>+977 9801234567</p>
                    <p>hello@kingseatery.com</p>
                  </div>
                </div>
                <a 
                  href="https://maps.google.com/?q=Sanepa+Chowk+Lalitpur+Kathmandu+Nepal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.directionBtn}
                >
                  <FaDirections /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Reach Section */}
      <section className={styles.transport}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Getting Here</span>
            <h2 className={styles.sectionTitle}>How to Reach Us</h2>
          </div>
          <div className={styles.transportGrid}>
            {transportOptions.map((option, index) => (
              <div key={index} className={styles.transportCard}>
                <div className={styles.transportIcon}>
                  <option.icon />
                </div>
                <h3 className={styles.transportTitle}>{option.title}</h3>
                <p className={styles.transportDescription}>{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Landmarks */}
      <section className={styles.landmarks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Around Us</span>
            <h2 className={styles.sectionTitle}>Nearby Landmarks</h2>
          </div>
          <div className={styles.landmarksGrid}>
            {nearbyLandmarks.map((landmark, index) => (
              <div key={index} className={styles.landmarkCard}>
                <div className={styles.landmarkIcon}>
                  <landmark.icon />
                </div>
                <div className={styles.landmarkInfo}>
                  <h4 className={styles.landmarkName}>{landmark.name}</h4>
                  <span className={styles.landmarkDistance}>{landmark.distance}</span>
                  <p className={styles.landmarkDescription}>{landmark.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className={styles.amenities}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Facilities</span>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
          </div>
          <div className={styles.amenitiesGrid}>
            {amenities.map((amenity, index) => (
              <div key={index} className={styles.amenityCard}>
                <div className={styles.amenityIcon}>
                  <amenity.icon />
                </div>
                <h3 className={styles.amenityTitle}>{amenity.title}</h3>
                <p className={styles.amenityDescription}>{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Find<br />Your New Favorite Spot?</h2>
          <p className={styles.ctaText}>We&apos;re waiting to serve you something amazing</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn} onClick={navigateToMenu}>
              <FaUtensils style={{marginRight: '8px'}} /> Order Online
            </button>
            <a href="tel:+9779801234567" className={styles.secondaryBtn}>
              <FaPhone style={{marginRight: '8px'}} /> Call Us
            </a>
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