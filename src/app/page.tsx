import Link from 'next/link';
import styles from './page.module.css';
import { Mic2, Ampersand, MapPin, Globe, MessageCircle, Phone, CalendarDays, Wind, Coffee, Bike } from 'lucide-react';
import RoomShowcase from '@/components/RoomShowcase';

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
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.2rem' }}>
            Descubrí los espacios diseñados específicamente para potenciar tu creatividad.
          </p>
          <RoomShowcase />
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
      <section id="direccion" className={`${styles.section} ${styles.darkBg}`}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>DÓNDE ESTAMOS</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Ubicados en el centro neurálgico de la música. Fácil acceso desde cualquier punto de la ciudad.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <MapPin color="var(--accent-color)" size={24} />
                <span style={{ fontSize: '1.1rem' }}>Calle 64 entre 15 y 16 N° 1158, La Plata, Buenos Aires.</span>
              </div>
            </div>

            <div className={styles.map}>
              {/* Embed Google Maps */}
              <iframe 
                src="https://www.google.com/maps?q=Calle+64+1158,+La+Plata,+Buenos+Aires&output=embed" 
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
