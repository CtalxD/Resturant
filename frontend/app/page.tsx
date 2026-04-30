//frontend/app/page.tsx
'use client';
import Image from 'next/image';
import styles from './styles/page.module.css';
import { useRouter } from 'next/navigation';
import { 
  FaHamburger, 
  FaCoffee, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone, 
  FaInstagram, 
  FaFacebook, 
  FaTwitter,
  FaUtensils,
  FaCrown,
  FaQuoteLeft,
  FaChevronRight,
  FaCheck,
  FaFire,
  FaHeart,
  FaGlassCheers,
  FaBreadSlice,
  FaAward
} from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

  const menuItems = [
    {
      category: "Signature Burgers",
      icon: FaHamburger,
      items: [
        { name: "Texas BBQ Burger", description: "Smoked brisket, cheddar, crispy onions, house BBQ sauce", price: "850" },
        { name: "Pulled Pork Burger", description: "24hr slow-cooked pork, coleslaw, pickled jalapeños", price: "780" },
        { name: "Hot Chicken Burger", description: "Nashville-style fried chicken, slaw, sriracha mayo", price: "720" },
        { name: "Classic Cheeseburger", description: "Double patty, American cheese, special sauce", price: "650" },
      ]
    },
    {
      category: "Brunch & Sides",
      icon: FaBreadSlice,
      items: [
        { name: "Loaded Fries", description: "Bacon, cheese sauce, spring onions, sour cream", price: "450" },
        { name: "Mozzarella Sticks", description: "Crispy fried mozzarella with marinara dip", price: "380" },
        { name: "Avocado Toast", description: "Sourdough, smashed avocado, poached eggs", price: "520" },
        { name: "Butter Croissant", description: "Freshly baked, served with jam & butter", price: "280" },
      ]
    }
  ];

  const features = [
    { icon: FaAward, title: "Premium Quality", description: "Handcrafted with the finest ingredients" },
    { icon: FaGlassCheers, title: "Vibrant Atmosphere", description: "The perfect spot for food lovers" },
    { icon: FaFire, title: "Made Fresh Daily", description: "Everything prepared to order, always fresh" },
  ];

  const testimonials = [
    {
      quote: "Best burgers in Kathmandu, hands down. The Texas BBQ is absolutely phenomenal!",
      author: "Sagar P.",
      role: "Food Enthusiast"
    },
    {
      quote: "The vibe is perfect for weekend brunches. Their loaded fries are addictive.",
      author: "Anita M.",
      role: "Regular Customer"
    },
    {
      quote: "From the croissants to the pulled pork, everything tastes amazing. Worth every rupee.",
      author: "Rajesh K.",
      role: "Food Blogger"
    }
  ];

  const navigateToMenu = () => {
    router.push('/menu');
  };

  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <FaCrown className={styles.logoIcon} />
            <div>
              <span className={styles.logoText}>KINGS</span>
              <span className={styles.logoSubtext}>EATERY</span>
            </div>
          </div>
          <div className={styles.navLinks}>
            <a href="/menu">Menu</a>
            <a href="/about">About</a>
            <a href="/location">Location</a>
            <a href="/contact">Contact</a>
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
            <FaFire className={styles.badgeIcon} />
            <span>Kathmandu's Favorite Since 2019</span>
          </div>
          <h1 className={styles.heroTitle}>
            Where <span className={styles.goldText}>Burgers</span> Meet<br />
            <span className={styles.goldText}>Brunch</span> Culture
          </h1>
          <p className={styles.heroDescription}>
            Craft burgers and indulgent comfort food in a setting that's both refined and welcoming.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn} onClick={navigateToMenu}>
              Explore Menu <FaChevronRight className={styles.btnIcon} />
            </button>
            <button className={styles.secondaryBtn} onClick={navigateToMenu}>
              Order Online
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <FaStar className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>4.8</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <FaHamburger className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>50+</div>
                <div className={styles.statLabel}>Menu Items</div>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <FaMapMarkerAlt className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>Sanepa</div>
                <div className={styles.statLabel}>Lalitpur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Why Choose Us</span>
            <h2 className={styles.sectionTitle}>The kings Standard</h2>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className={styles.menu}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Our Menu</span>
            <h2 className={styles.sectionTitle}>Crafted to Perfection</h2>
          </div>
          <div className={styles.menuGrid}>
            {menuItems.map((category, catIndex) => (
              <div key={catIndex} className={styles.menuCategory}>
                <h3 className={styles.categoryTitle}>
                  <category.icon /> {category.category}
                </h3>
                <div className={styles.menuItems}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.menuItem}>
                      <div className={styles.menuItemHeader}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <span className={styles.itemPrice}>Rs. {item.price}</span>
                      </div>
                      <p className={styles.itemDescription}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.menuNote}>
            <FaCheck className={styles.checkIcon} />
            <span>All burgers served with hand-cut fries and house slaw</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Testimonials</span>
            <h2 className={styles.sectionTitle}>What Guests Say</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p className={styles.quoteText}>{testimonial.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.authorName}>{testimonial.author}</div>
                    <div className={styles.authorRole}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="location" className={styles.info}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Location</h3>
              <p className={styles.infoText}>Sanepa, Lalitpur</p>
              <p className={styles.infoSubtext}>Kathmandu, Nepal</p>
            </div>
            <div className={styles.infoCard}>
              <FaClock className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Hours</h3>
              <p className={styles.infoText}>Mon - Sun</p>
              <p className={styles.infoSubtext}>10:00 AM - 9:00 PM</p>
            </div>
            <div className={styles.infoCard}>
              <FaPhone className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Contact</h3>
              <p className={styles.infoText}>+977 9801234567</p>
              <p className={styles.infoSubtext}>hello@kingseatery.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready for the Best<br />Burger in Town?</h2>
          <p className={styles.ctaText}>Experience the perfect blend of quality and comfort</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>
              <FaUtensils style={{marginRight: '8px'}} /> Reserve a Table
            </button>
            <button className={styles.secondaryBtn} onClick={navigateToMenu}>
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <FaCrown className={styles.logoIcon} />
                <span className={styles.logoText}>kings</span>
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
              <a href="#menu">Menu</a>
              <a href="#about">Our Story</a>
              <a href="#location">Find Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToMenu(); }}>Order Online</a>
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
            <p>&copy; 2024 Kings Eatery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}