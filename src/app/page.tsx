import Link from 'next/link';
import styles from './page.module.css';
import { Mic2, Ampersand, MapPin, Globe, MessageCircle, Phone, CalendarDays, Wind, Coffee, Bike } from 'lucide-react';
import RoomCarousel from '@/components/RoomCarousel';

export default function Home() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            LLEVÁ TU SONIDO AL <span style={{ color: 'var(--accent-color)' }}>PRÓXIMO NIVEL</span>
          </h1>
          <p className={styles.subtitle}>
            Salas de ensayo equipadas con la mejor tecnología. Acústica perfecta y el ambiente ideal para bandas exigentes.
          </p>
          <div className={styles.actions}>
            <Link href="/reservar" className="btn-primary">
              <CalendarDays size={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}/>
              Reservar Turno
            </Link>
            <Link href="#salas" className="btn-secondary">
              Ver Salas
            </Link>
          </div>
        </div>
      </section>

      {/* Salas Section */}
      <section id="salas" className={`${styles.section} ${styles.darkBg}`}>
        <div className="container">
          <h2 className="section-title">Nuestras Salas</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
            Descubrí los espacios diseñados específicamente para potenciar tu creatividad.
          </p>
          <RoomCarousel />
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className={styles.section}>
        <div className="container">
          <h2 className="section-title">Servicios disponibles</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Wind size={48} />
              </div>
              <h3 className={styles.cardTitle}>Climatización Ideal</h3>
              <p className={styles.cardText}>Todas nuestras salas cuentan con aire acondicionado frío/calor para que ensayes cómodo en cualquier época del año.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Coffee size={48} />
              </div>
              <h3 className={styles.cardTitle}>Zonas de Relax</h3>
              <p className={styles.cardText}>Relajate antes o después del ensayo en nuestro amplio patio y cómoda sala de estar equipada.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Bike size={48} />
              </div>
              <h3 className={styles.cardTitle}>Estacionamiento Seguro</h3>
              <p className={styles.cardText}>Contamos con un lugar seguro y cerrado para dejar bicicletas y motos mientras disfrutas de tu turno.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info & Location Section */}
      <section id="contacto" className={`${styles.section} ${styles.darkBg}`}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>DÓNDE ESTAMOS</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Ubicados en el centro neurálgico de la música. Fácil acceso desde cualquier punto de la ciudad.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <MapPin color="var(--accent-color)" size={24} />
                <span style={{ fontSize: '1.1rem' }}>Calle 64 N° 1158, La Plata, Buenos Aires</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                <Phone color="var(--accent-color)" size={24} />
                <span style={{ fontSize: '1.1rem' }}>+54 9 221 558-8276</span>
              </div>

              <div className={styles.socials}>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">
                  <MessageCircle size={24} />
                </a>
                <a href="#" className={styles.socialBtn} aria-label="WhatsApp">
                  <Phone size={24} />
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Facebook">
                  <Globe size={24} />
                </a>
              </div>
            </div>

            <div className={styles.map}>
              {/* Embed Google Maps */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.748721666978!2d-57.9427181!3d-34.9120197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e66d034446c7%3A0xc3fbfb0b30a515f4!2sC.%2064%201017%2C%20B1904CPK%20La%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1682348574760!5m2!1ses-419!2sar" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
