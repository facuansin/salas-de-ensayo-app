import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="contacto" className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <h2 className={styles.brandName}>PLANETA ROCK</h2>
            <p className={styles.brandDesc}>
              Tu sonido al próximo nivel. Salas de ensayo con equipamiento premium y acústica profesional en La Plata.
            </p>
          </div>
          
          <div className={styles.contact}>
            <h3 className={styles.title}>Contacto</h3>
            <ul className={styles.contactList}>
              <li>
                <a href="https://wa.me/5492215588276" target="_blank" rel="noreferrer" className={styles.contactLink}>
                  <Phone size={20} />
                  <span>+54 9 221 558-8276</span>
                </a>
              </li>
              <li>
                <a href="mailto:feransin@gmail.com" className={styles.contactLink}>
                  <Mail size={20} />
                  <span>feransin@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.socials}>
            <h3 className={styles.title}>Seguinos</h3>
            <div className={styles.socialIcons}>
              <a 
                href="https://www.instagram.com/salasdeensayoplanetarock/" 
                target="_blank" 
                rel="noreferrer" 
                className={styles.socialBtn}
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://www.facebook.com/PlanetaRockSalasDeEnsayo/" 
                target="_blank" 
                rel="noreferrer" 
                className={styles.socialBtn}
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} Planeta Rock Salas de Ensayo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
