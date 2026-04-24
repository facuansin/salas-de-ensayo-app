'use client';
import styles from './RoomShowcase.module.css';
import ImageCarousel from './ImageCarousel';
import Link from 'next/link';

const rooms = [
  {
    id: 1,
    name: "Sala 1 (Planta Alta)",
    images: [
      "/images/sala1.png",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+2",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+3",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+4",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+5",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+6",
      "https://placehold.co/800x600/1a1a2e/e94560?text=Sala+1+-+7"
    ],
    description: "Nuestra sala más grande. Ideal para bandas de más de 5 integrantes. Cuenta con batería Pearl Export de 6 cuerpos, amplificadores valvulares Marshall y Fender, cabezal Ampeg para bajo y sistema de monitoreo in-ear.",
    features: ["45m² de espacio", "Acústica premium", "Batería Pearl Export", "Monitoreo In-Ear"]
  },
  {
    id: 2,
    name: "Sala 2 (Planta Alta)",
    images: [
      "/images/sala2.png",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+2",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+3",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+4",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+5",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+6",
      "https://placehold.co/800x600/16213e/0f3460?text=Sala+2+-+7"
    ],
    description: "Diseñada específicamente para ensambles acústicos, jazz y grabaciones de voces. Tratamiento acústico de primera línea, piano de cola y micrófonos condensadores de estudio.",
    features: ["Piano de Cola Yamaha", "Micrófonos Condensadores", "Diseño intimista", "Climatización silenciosa"]
  },
  {
    id: 3,
    name: "Sala 3",
    images: [
      "/images/sala3.png",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+2",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+3",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+4",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+5",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+6",
      "https://placehold.co/800x600/0f0f1b/8a2be2?text=Sala+3+-+7"
    ],
    description: "Perfecta para DJs, productores de música electrónica y bandas modernas. Incluye controladores MIDI, sintetizadores análogos, iluminación dinámica LED y monitores de estudio KRK.",
    features: ["Iluminación LED RGB", "Sintetizadores Análogos", "Monitores KRK", "Acústica absorbente"]
  }
];

export default function RoomShowcase() {
  return (
    <div className={styles.showcaseContainer}>
      {rooms.map((room, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={room.id} className={`${styles.roomRow} ${isEven ? styles.rowEven : styles.rowOdd}`}>
            <div className={styles.carouselSection}>
              <ImageCarousel images={room.images} altPrefix={room.name} />
            </div>
            
            <div className={styles.infoSection}>
              <h3 className={styles.roomName}>{room.name}</h3>
              <p className={styles.roomDescription}>{room.description}</p>
              
              <ul className={styles.featureList}>
                {room.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.bullet}>•</span> {feature}
                  </li>
                ))}
              </ul>
              
              <Link href={`/reservar?sala=${room.id}`} className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                Reservar esta sala
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
