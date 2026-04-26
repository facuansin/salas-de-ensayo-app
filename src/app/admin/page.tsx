'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reservas');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [blockForm, setBlockForm] = useState({ roomId: '', date: '', startTime: 10, duration: 1, reason: '' });
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes, blRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/rooms'),
        fetch('/api/admin/blocks/all')
      ]);

      setBookings(await bRes.json());
      const fetchedRooms = await rRes.json();
      setRooms(fetchedRooms);
      setBlockedTimes(await blRes.json());
      
      if (fetchedRooms.length > 0 && !blockForm.roomId) {
        setBlockForm(f => ({ ...f, roomId: fetchedRooms[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // --- ACTIONS ---
  const cancelBooking = async (id: string) => {
    if (!confirm('¿Seguro que querés cancelar esta reserva?')) return;
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      fetchData();
    } catch (err) { alert('Error al cancelar'); }
  };

  const saveEdit = async (b: any) => {
    const newDate = (document.getElementById(`edit-date-${b.id}`) as HTMLInputElement).value;
    const newStart = Number((document.getElementById(`edit-start-${b.id}`) as HTMLSelectElement).value);
    const newDur = Number((document.getElementById(`edit-dur-${b.id}`) as HTMLSelectElement).value);
    
    const roomInfo = rooms.find(r => r.name === b.room.name);
    const pricePerHour = roomInfo ? roomInfo.pricePerHour : (b.totalPrice / b.duration);
    const newTotal = pricePerHour * newDur;

    try {
      await fetch(`/api/admin/bookings/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, startTime: newStart, duration: newDur, totalPrice: newTotal })
      });
      setEditingBookingId(null);
      fetchData();
    } catch (err) { alert('Error al guardar edición'); }
  };

  const updateRoomPrice = async (id: string, newPrice: number) => {
    if (!confirm(`¿Actualizar precio a $${newPrice}?`)) return;
    try {
      await fetch(`/api/admin/rooms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerHour: newPrice })
      });
      alert('Precio actualizado');
      fetchData();
    } catch (err) { alert('Error al actualizar precio'); }
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockForm.date || !blockForm.roomId) return alert('Completa todos los campos obligatorios');
    try {
      await fetch('/api/admin/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockForm)
      });
      alert('Horario bloqueado con éxito');
      setBlockForm({ ...blockForm, date: '', reason: '' });
      fetchData();
    } catch (err) { alert('Error al bloquear horario'); }
  };

  const removeBlock = async (id: string) => {
    if (!confirm('¿Eliminar este bloqueo de horario?')) return;
    try {
      await fetch(`/api/admin/blocks/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { alert('Error al eliminar bloqueo'); }
  };

  // --- RENDERS ---
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Cerrar Sesión</button>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'reservas' ? styles.activeTab : ''}`} onClick={() => setActiveTab('reservas')}>
          Reservas
        </button>
        <button className={`${styles.tab} ${activeTab === 'bloqueos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('bloqueos')}>
          Bloquear Horarios
        </button>
        <button className={`${styles.tab} ${activeTab === 'salas' ? styles.activeTab : ''}`} onClick={() => setActiveTab('salas')}>
          Salas y Precios
        </button>
      </div>

      {loading ? (
        <p>Cargando panel...</p>
      ) : (
        <>
          {activeTab === 'reservas' && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Agenda de Reservas</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fecha y Hora</th>
                      <th>Sala</th>
                      <th>Cliente</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={6} style={{textAlign: 'center'}}>No hay reservas</td></tr>
                    ) : bookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          {editingBookingId === b.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <input type="date" className={styles.input} defaultValue={b.date} id={`edit-date-${b.id}`} />
                              <div style={{ display: 'flex', gap: '5px' }}>
                                <select className={styles.select} id={`edit-start-${b.id}`} defaultValue={b.startTime}>
                                  {Array.from({length: 14}, (_, i) => i + 10).map(h => <option key={h} value={h}>{h}:00</option>)}
                                </select>
                                <select className={styles.select} id={`edit-dur-${b.id}`} defaultValue={b.duration}>
                                  {[1,2,3,4,5,6,8,10,12].map(h => <option key={h} value={h}>{h}h</option>)}
                                </select>
                              </div>
                            </div>
                          ) : (
                            `${b.date.split('-').reverse().join('/')} a las ${b.startTime}:00hs (${b.duration}h)`
                          )}
                        </td>
                        <td><strong>{b.room.name}</strong></td>
                        <td>{b.customerName} <br/><span style={{fontSize: '0.85rem', color: '#888'}}>{b.customerPhone}</span></td>
                        <td>${b.totalPrice.toLocaleString()}</td>
                        <td><span className={`${styles.status} ${styles[b.status.toLowerCase()]}`}>{b.status}</span></td>
                        <td>
                          {editingBookingId === b.id ? (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button onClick={() => saveEdit(b)} className={styles.actionBtn}>Guardar</button>
                              <button onClick={() => setEditingBookingId(null)} className={styles.actionBtn} style={{borderColor: '#888', color: '#888'}}>X</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              {b.status !== 'CANCELLED' && (
                                <>
                                  <button onClick={() => setEditingBookingId(b.id)} className={styles.actionBtn} style={{borderColor: '#4caf50', color: '#4caf50'}}>Editar</button>
                                  <button onClick={() => cancelBooking(b.id)} className={styles.actionBtn}>Cancelar</button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bloqueos' && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Bloquear Fechas y Horarios</h2>
              <form onSubmit={handleCreateBlock} style={{ marginBottom: '40px', backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '8px' }}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Sala</label>
                    <select className={styles.select} value={blockForm.roomId} onChange={e => setBlockForm({...blockForm, roomId: e.target.value})}>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fecha</label>
                    <input type="date" required className={styles.input} value={blockForm.date} onChange={e => setBlockForm({...blockForm, date: e.target.value})} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Hora de inicio</label>
                    <select className={styles.select} value={blockForm.startTime} onChange={e => setBlockForm({...blockForm, startTime: Number(e.target.value)})}>
                      {Array.from({length: 14}, (_, i) => i + 10).map(h => <option key={h} value={h}>{h}:00</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Duración (horas)</label>
                    <select className={styles.select} value={blockForm.duration} onChange={e => setBlockForm({...blockForm, duration: Number(e.target.value)})}>
                      {[1,2,3,4,5,6,8,10,12].map(h => <option key={h} value={h}>{h} horas</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Motivo (opcional)</label>
                    <input type="text" placeholder="Ej: Mantenimiento, Feriado..." className={styles.input} value={blockForm.reason} onChange={e => setBlockForm({...blockForm, reason: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Bloquear Horario</button>
              </form>

              <h2 className={styles.panelTitle} style={{fontSize: '1.2rem'}}>Horarios Bloqueados Actuales</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fecha y Hora</th>
                      <th>Sala</th>
                      <th>Motivo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedTimes.length === 0 ? <tr><td colSpan={4}>No hay bloqueos activos</td></tr> : blockedTimes.map(bl => (
                      <tr key={bl.id}>
                        <td>{bl.date.split('-').reverse().join('/')} - {bl.startTime}:00hs ({bl.duration}h)</td>
                        <td>{bl.room?.name || 'Sala'}</td>
                        <td>{bl.reason || '-'}</td>
                        <td><button onClick={() => removeBlock(bl.id)} className={styles.actionBtn}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'salas' && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Gestión de Salas y Precios</h2>
              <div className={styles.roomGrid}>
                {rooms.map(room => (
                  <div key={room.id} className={styles.roomCard}>
                    <h3>{room.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Precio actual: ${room.pricePerHour}/hs</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="number" 
                        defaultValue={room.pricePerHour} 
                        id={`price-${room.id}`}
                        className={styles.input} 
                        style={{ width: '120px' }}
                      />
                      <button 
                        onClick={() => {
                          const val = (document.getElementById(`price-${room.id}`) as HTMLInputElement).value;
                          updateRoomPrice(room.id, Number(val));
                        }} 
                        className={styles.actionBtn}
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
