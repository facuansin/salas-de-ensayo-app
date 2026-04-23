'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

type Room = {
  id: string;
  name: string;
  pricePerHour: number;
  bookings: any[];
  blockedTimes: any[];
};

export default function ReservarPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(2); // Default 2 hours
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchRooms();
  }, [date]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms?date=${date}`);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getAvailableSlots = (room: Room) => {
    // Generate slots from 10:00 to 23:00
    const slots = [];
    for (let i = 10; i <= 23; i++) {
      slots.push(i);
    }

    const occupiedHours = new Set<number>();
    
    room.bookings.forEach((b: any) => {
      for (let i = 0; i < b.duration; i++) {
        occupiedHours.add(b.startTime + i);
      }
    });

    room.blockedTimes.forEach((b: any) => {
      for (let i = 0; i < b.duration; i++) {
        occupiedHours.add(b.startTime + i);
      }
    });

    return slots.map(hour => ({
      hour,
      available: !occupiedHours.has(hour)
    }));
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || selectedTime === null) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          date,
          startTime: selectedTime,
          duration,
          totalPrice: selectedRoom.pricePerHour * duration
        })
      });

      if (res.ok) {
        alert('¡Reserva confirmada con éxito! (En una versión final te redirigiría a MercadoPago)');
        fetchRooms();
        setSelectedRoom(null);
        setSelectedTime(null);
      } else {
        alert('Hubo un error al reservar.');
      }
    } catch (err) {
      alert('Error de red.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RESERVAR TU SALA</h1>
      
      <div className={styles.grid}>
        {/* Left Column: Date & Rooms */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>1. Elegí la fecha</h2>
          <input 
            type="date" 
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <h2 className={styles.panelTitle}>2. Elegí sala y horario</h2>
          {loading ? (
            <p>Cargando disponibilidad...</p>
          ) : (
            rooms.map(room => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomHeader}>
                  <span className={styles.roomName}>{room.name}</span>
                  <span className={styles.roomPrice}>${room.pricePerHour.toLocaleString()}/hs</span>
                </div>
                
                <div className={styles.timeGrid}>
                  {getAvailableSlots(room).map(slot => (
                    <button
                      key={slot.hour}
                      className={`${styles.timeSlot} ${
                        selectedRoom?.id === room.id && selectedTime === slot.hour ? styles.selected : ''
                      }`}
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedRoom(room);
                        setSelectedTime(slot.hour);
                      }}
                    >
                      {slot.hour}:00
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Checkout Form */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>3. Confirmar Reserva</h2>
          
          {!selectedRoom || selectedTime === null ? (
            <p style={{ color: 'var(--text-secondary)' }}>Seleccioná una sala y un horario para continuar.</p>
          ) : (
            <form onSubmit={handleBook}>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Sala:</span>
                  <strong>{selectedRoom.name}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Fecha:</span>
                  <strong>{date.split('-').reverse().join('/')} a las {selectedTime}:00hs</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Duración:</span>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', fontWeight: 'bold' }}
                  >
                    <option value={1} style={{color: '#000'}}>1 hora</option>
                    <option value={2} style={{color: '#000'}}>2 horas</option>
                    <option value={3} style={{color: '#000'}}>3 horas</option>
                    <option value={4} style={{color: '#000'}}>4 horas</option>
                  </select>
                </div>
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--accent-color)' }}>
                    ${(selectedRoom.pricePerHour * duration).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre completo</label>
                <input 
                  required
                  type="text" 
                  className={styles.input}
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input 
                  required
                  type="email" 
                  className={styles.input}
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp / Teléfono</label>
                <input 
                  required
                  type="tel" 
                  className={styles.input}
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Confirmar y Pagar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
