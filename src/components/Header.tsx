import Link from 'next/link';
import styles from './Header.module.css';
import { Guitar } from 'lucide-react';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Guitar className={styles.logoIcon} size={32} />
          <span>PLANETA<span className={styles.accent}>ROCK</span></span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/#salas" className={styles.navLink}>Salas</Link>
          <Link href="/#beneficios" className={styles.navLink}>Beneficios</Link>
          <Link href="/#contacto" className={styles.navLink}>Contacto</Link>
          <Link href="/reservar" className="btn-primary">Reservar Ahora</Link>
        </nav>
      </div>
    </header>
  );
}
