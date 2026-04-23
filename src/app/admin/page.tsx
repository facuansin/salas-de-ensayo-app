'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: number;
  duration: number;
  totalPrice: number;
  status: string;
  room: {
    name: string;
  };
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('¿Seguro que querés cancelar esta reserva?')) return;
    
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      fetchBookings();
    } catch (err) {
      alert('Error al cancelar la reserva');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de Control</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Sala</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{textAlign: 'center'}}>Cargando reservas...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign: 'center'}}>No hay reservas todavía.</td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    {b.date.split('-').reverse().join('/')} <br/>
                    <span style={{ color: 'var(--text-secondary)'}}>
                      {b.startTime}:00hs ({b.duration}h)
                    </span>
                  </td>
                  <td><strong>{b.room.name}</strong></td>
                  <td>{b.customerName}</td>
                  <td>{b.customerPhone}</td>
                  <td>${b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${styles[b.status.toLowerCase()]}`}>
                      {b.status === 'PENDING' ? 'Pendiente' : b.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
                    </span>
                  </td>
                  <td>
                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => cancelBooking(b.id)} className={styles.cancelBtn}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
