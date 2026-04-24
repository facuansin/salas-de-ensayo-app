'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './RoomCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const rooms = [
  {
    id: 1,
    name: "Sala Principal 'The Stadium'",
    image: "/images/sala1.png",
    description: "Nuestra sala más grande. Ideal para bandas de más de 5 integrantes. Cuenta con batería Pearl Export de 6 cuerpos, amplificadores valvulares Marshall y Fender, cabezal Ampeg para bajo y sistema de monitoreo in-ear.",
  },
  {
    id: 2,
    name: "Sala Acústica 'The Studio'",
    image: "/images/sala2.png",
    description: "Diseñada específicamente para ensambles acústicos, jazz y grabaciones de voces. Tratamiento acústico de primera línea, piano de cola y micrófonos condensadores de estudio.",
  },
  {
    id: 3,
    name: "Sala Moderna 'The Neon'",
    image: "/images/sala3.png",
    description: "Perfecta para DJs, productores de música electrónica y bandas modernas. Incluye controladores MIDI, sintetizadores análogos, iluminación dinámica LED y monitores de estudio KRK.",
  }
];

export default function RoomCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.imageContainer}>
        <button onClick={prevSlide} className={`${styles.navButton} ${styles.prev}`}>
          <ChevronLeft size={32} />
        </button>
        
        <Image 
          src={rooms[currentIndex].image} 
          alt={rooms[currentIndex].name} 
          fill
          style={{ objectFit: 'cover' }}
          className={styles.image}
          unoptimized
        />
        
        <button onClick={nextSlide} className={`${styles.navButton} ${styles.next}`}>
          <ChevronRight size={32} />
        </button>
        
        <div className={styles.indicators}>
          {rooms.map((_, idx) => (
            <div 
              key={idx} 
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.infoContainer}>
        <h3 className={styles.roomName}>{rooms[currentIndex].name}</h3>
        <p className={styles.roomDescription}>{rooms[currentIndex].description}</p>
      </div>
    </div>
  );
}
