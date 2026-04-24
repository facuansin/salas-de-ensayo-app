'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  altPrefix: string;
}

export default function ImageCarousel({ images, altPrefix }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      <button onClick={prevSlide} className={`${styles.navButton} ${styles.prev}`}>
        <ChevronLeft size={24} />
      </button>
      
      <div className={styles.imageWrapper}>
        <Image 
          src={images[currentIndex]} 
          alt={`${altPrefix} - Imagen ${currentIndex + 1}`} 
          fill
          style={{ objectFit: 'cover' }}
          className={styles.image}
          unoptimized
        />
      </div>
      
      <button onClick={nextSlide} className={`${styles.navButton} ${styles.next}`}>
        <ChevronRight size={24} />
      </button>
      
      <div className={styles.indicators}>
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
