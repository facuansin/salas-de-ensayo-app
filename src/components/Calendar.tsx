'use client';

import { useState } from 'react';
import styles from './Calendar.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  occupiedDates?: string[];
}

export default function Calendar({ selectedDate, onDateSelect, occupiedDates = [] }: CalendarProps) {
  // Use local time parsing to avoid timezone offset issues
  const parseDate = (dString: string) => {
    if (!dString) return new Date();
    const [y, m, d] = dString.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const [currentMonth, setCurrentMonth] = useState(parseDate(selectedDate));

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  // Adjust so Monday is 0
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const isPast = date < today;
      const isSelected = dateString === selectedDate;
      const isOccupied = occupiedDates.includes(dateString);

      days.push(
        <button
          key={i}
          disabled={isPast}
          className={`${styles.dayBtn} ${isSelected ? styles.selected : ''} ${isPast ? styles.past : ''}`}
          onClick={() => onDateSelect(dateString)}
        >
          {i}
          {isOccupied && !isPast && <div className={styles.occupiedDot}></div>}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={20} /></button>
        <span className={styles.monthName}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={20} /></button>
      </div>
      <div className={styles.weekDays}>
        <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
      </div>
      <div className={styles.daysGrid}>
        {renderDays()}
      </div>
    </div>
  );
}
