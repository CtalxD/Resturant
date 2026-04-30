'use client';
import styles from './about.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaCrown,
  FaUtensils,
  FaHeart,
  FaStar,
  FaAward,
  FaQuoteLeft,
  FaFire,
  FaLeaf,
  FaUsers,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaCheck,
  FaArrowRight,
  FaSeedling,
  FaBreadSlice
} from 'react-icons/fa';

export default function AboutPage() {
  const router = useRouter();

  const teamMembers = [
    {
      name: "Rajendra Maharjan",
      role: "Head Chef & Founder",
      description: "20+ years of culinary expertise",
      initial: "R"
    },
    {
      name: "Sunita Shrestha",
      role: "Pastry Chef",
      description: "French-trained pastry artist",
      initial: "S"
    },
    {
      name: "Bikram Tamang",
      role: "Sous Chef",
      description: "Specialist in grilled perfection",
      initial: "B"
    },
    {
      name: "Maya Gurung",
      role: "Restaurant Manager",
      description: "Ensuring your perfect experience",
      initial: "M"
    }
  ];

  const values = [
    {
      icon: FaSeedling,
      title: "Fresh Ingredients",
      description: "We source the finest local and imported ingredients daily. Every dish is prepared to order, ensuring peak freshness and flavor in every bite."
    },
    {
      icon: FaFire,
      title: "Culinary Passion",
      description: "Our kitchen is driven by a relentless passion for creating exceptional food. We blend traditional techniques with modern innovation to craft unforgettable dishes."
    },
    {
      icon: FaHeart,
      title: "Made with Love",
      description: "Every burger, every pastry, every dish that leaves our kitchen carries the warmth and care of our team. Food is our love language."
    },
    {
      icon: FaUsers,
      title: "Community First",
      description: "Kings Eatery is more than a restaurant — it's a gathering place. We're proud to be part of the Sanepa community, bringing people together through great food."
    },
    {
      icon: FaAward,
      title: "Quality Promise",
      description: "From our signature burgers to our handcrafted brunch items, we never compromise on quality. Every ingredient is carefully selected, every technique perfected."
    },
    {
      icon: FaLeaf,
      title: "Sustainability",
      description: "We care about our planet. From eco-friendly packaging to minimizing food waste, we're committed to sustainable practices that protect our environment."
    }
  ];

  const milestones = [
    { year: "2019", title: "The Beginning", description: "Kings Eatery opened its doors in Sanepa with a simple mission: serve the best burgers in Kathmandu." },
    { year: "2020", title: "Brunch Culture", description: "Expanded our menu to include artisanal brunch items, becoming a weekend favorite." },
    { year: "2021", title: "Community Favorite", description: "Recognized as one of the top eateries in Lalitpur, with a growing family of loyal guests." },
    { year: "2022", title: "Innovation", description: "Introduced our signature Texas BBQ Burger and expanded our craft beverage selection." },
    { year: "2024", title: "Growing Strong", description: "50+ menu items, thousands of happy guests, and a commitment to keep getting better every day." }
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
            <Link href="/about" className={styles.activeLink}>About</Link>
            <Link href="/location">Location</Link>
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
            <FaFire className={styles.badgeIcon} />
            <span>Our Story Since 2019</span>
          </div>
          <h1 className={styles.heroTitle}>
            Crafting <span className={styles.goldText}>Memories</span><br />
            One <span className={styles.goldText}>Plate</span> at a Time
          </h1>
          <p className={styles.heroDescription}>
            From our kitchen to your table, every dish tells a story of passion, quality, and the love for great food.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Our Journey</span>
                <h2 className={styles.sectionTitle}>The Kings Legacy</h2>
              </div>
              <div className={styles.storyText}>
                <p>
                  Kings Eatery was born from a simple belief: that great food brings people together. 
                  What started as a small burger joint in the heart of Sanepa has grown into one of 
                  Lalitpur&apos;s most beloved eateries.
                </p>
                <p>
                  Our founder, Chef Rajendra Maharjan, spent years perfecting his craft in kitchens 
                  across Nepal and abroad. When he returned home, he knew exactly what Kathmandu 
                  was missing — a place where premium quality meets warm Nepali hospitality.
                </p>
                <p>
                  Today, Kings Eatery stands as a testament to that vision. From our signature 
                  slow-smoked Texas BBQ Burger to our delicate French-inspired pastries, every item 
                  on our menu is crafted with the same dedication and love that started it all.
                </p>
                <p>
                  We&apos;re not just a restaurant — we&apos;re a gathering place, a community hub, and a 
                  celebration of everything that makes food wonderful.
                </p>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.storyCard}>
                <FaUtensils className={styles.storyIcon} />
                <div className={styles.storyStats}>
                  <div className={styles.storyStat}>
                    <span className={styles.storyStatNumber}>5+</span>
                    <span className={styles.storyStatLabel}>Years of Excellence</span>
                  </div>
                  <div className={styles.storyDivider} />
                  <div className={styles.storyStat}>
                    <span className={styles.storyStatNumber}>50+</span>
                    <span className={styles.storyStatLabel}>Menu Items</span>
                  </div>
                  <div className={styles.storyDivider} />
                  <div className={styles.storyStat}>
                    <span className={styles.storyStatNumber}>10K+</span>
                    <span className={styles.storyStatLabel}>Happy Guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What Drives Us</span>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon />
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Meet Our Family</span>
            <h2 className={styles.sectionTitle}>The People Behind Kings</h2>
          </div>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.memberAvatar}>
                  {member.initial}
                </div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <span className={styles.memberRole}>{member.role}</span>
                <p className={styles.memberDescription}>{member.description}</p>
                <div className={styles.memberSocial}>
                  <span className={styles.socialDot} />
                  <span className={styles.socialDot} />
                  <span className={styles.socialDot} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timeline}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Our Growth</span>
            <h2 className={styles.sectionTitle}>Milestones & Memories</h2>
          </div>
          <div className={styles.timelineList}>
            {milestones.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <span className={styles.timelineYearWrapper}>
                    <span className={styles.timelineYear}>{milestone.year}</span>
                  </span>
                  <div className={styles.timelineDot} />
                </div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                  <p className={styles.timelineDescription}>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.philosophyContent}>
            <FaQuoteLeft className={styles.quoteIcon} />
            <blockquote className={styles.quote}>
              At Kings Eatery, we believe that food is more than sustenance — it&apos;s an experience. 
              Every burger we flip, every pastry we bake, and every plate we serve carries the 
              weight of our commitment to excellence. We don&apos;t just feed people; we create moments 
              that linger long after the last bite.
            </blockquote>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAvatar}>R</div>
              <div>
                <div className={styles.quoteName}>Rajendra Maharjan</div>
                <div className={styles.quoteRole}>Founder & Head Chef</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Experience<br />The Kings Difference?</h2>
          <p className={styles.ctaText}>Come taste what passion and quality truly mean</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn} onClick={navigateToMenu}>
              <FaUtensils style={{marginRight: '8px'}} /> Explore Our Menu
            </button>
            <Link href="/location" className={styles.secondaryBtn}>
              Find Us <FaArrowRight style={{marginLeft: '8px'}} />
            </Link>
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
            <p>&copy; 2024 Kings Eatery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}