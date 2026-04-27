'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Calendar from '@/components/Calendar';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reservas');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [blockForm, setBlockForm] = useState({ roomId: '', date: '', startTime: 10, duration: 1, reason: '' });
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);
  const [editDetailsForm, setEditDetailsForm] = useState({ customerName: '', customerPhone: '', date: '', startTime: 10, duration: 2 });

  const openEditModal = (booking: any) => {
    setSelectedBookingDetails(booking);
    setEditDetailsForm({
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      date: booking.date,
      startTime: booking.startTime,
      duration: booking.duration
    });
  };

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

  const deleteBooking = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar definitivamente esta reserva cancelada? Esto no se puede deshacer.')) return;
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (err) { alert('Error al eliminar'); }
  };



  const confirmPendingBooking = async (id: string) => {
    if (!confirm('¿Confirmar este turno manualmente?')) return;
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });
      setSelectedBookingDetails(null);
      fetchData();
    } catch (err) { alert('Error al confirmar'); }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomInfo = rooms.find(r => r.id === manualForm.roomId);
    if (!roomInfo) return;
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          totalPrice: roomInfo.pricePerHour * manualForm.duration
        })
      });
      setShowManualModal(false);
      fetchData();
    } catch (err) { alert('Error al crear reserva manual'); }
  };

  const saveModalEdit = async () => {
    if (!selectedBookingDetails) return;
    const roomInfo = rooms.find(r => r.name === selectedBookingDetails.room.name);
    const pricePerHour = roomInfo ? roomInfo.pricePerHour : (selectedBookingDetails.totalPrice / selectedBookingDetails.duration);
    const newTotal = pricePerHour * editDetailsForm.duration;

    try {
      await fetch(`/api/admin/bookings/${selectedBookingDetails.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editDetailsForm, totalPrice: newTotal })
      });
      setSelectedBookingDetails(null);
      fetchData();
    } catch (err) { alert('Error al guardar'); }
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>Agenda de Reservas</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setManualForm(f => ({...f, roomId: rooms[0]?.id || '', date: selectedCalendarDate })); setShowManualModal(true); }} className="btn-primary" style={{ padding: '8px 16px', marginRight: '10px' }}>+ Turno Manual</button>
                  <button onClick={() => setViewMode('list')} className={styles.actionBtn} style={{ backgroundColor: viewMode === 'list' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'list' ? '#fff' : 'var(--accent-color)' }}>Vista de Lista</button>
                  <button onClick={() => setViewMode('calendar')} className={styles.actionBtn} style={{ backgroundColor: viewMode === 'calendar' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'calendar' ? '#fff' : 'var(--accent-color)' }}>Vista Calendario</button>
                </div>
              </div>

              {viewMode === 'list' ? (
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
                            {b.date.split('-').reverse().join('/')} a las {b.startTime}:00hs ({b.duration}h)
                            <br />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Reservado el: {new Date(b.createdAt).toLocaleDateString('es-AR')} {new Date(b.createdAt).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </td>
                          <td><strong>{b.room.name}</strong></td>
                          <td>{b.customerName} <br/><span style={{fontSize: '0.85rem', color: '#888'}}>{b.customerPhone}</span></td>
                          <td>${b.totalPrice.toLocaleString()}</td>
                          <td><span className={`${styles.status} ${styles[b.status.toLowerCase()]}`}>{b.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              {b.status !== 'CANCELLED' ? (
                                <>
                                  <button onClick={() => openEditModal(b)} className={styles.actionBtn} style={{borderColor: '#4caf50', color: '#4caf50'}}>Editar</button>
                                  <button onClick={() => cancelBooking(b.id)} className={styles.actionBtn}>Cancelar</button>
                                </>
                              ) : (
                                <button onClick={() => deleteBooking(b.id)} className={styles.actionBtn} style={{borderColor: '#f44336', color: '#f44336'}}>Eliminar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '300px', maxWidth: '350px' }}>
                    <Calendar 
                      selectedDate={selectedCalendarDate} 
                      onDateSelect={setSelectedCalendarDate} 
                      occupiedDates={Array.from(new Set(bookings.filter(b => b.status !== 'CANCELLED').map(b => b.date)))}
                    />
                  </div>
                  <div style={{ flex: '2', minWidth: '300px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', padding: '20px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
                      Turnos del {selectedCalendarDate.split('-').reverse().join('/')}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto' }}>
                      {rooms.map(room => (
                        <div key={room.id} style={{ flex: 1, minWidth: '150px' }}>
                          <h4 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--accent-color)' }}>{room.name}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {Array.from({length: 14}, (_, i) => i + 10).map(hour => {
                              const booking = bookings.find(b => b.room.name === room.name && b.date === selectedCalendarDate && hour >= b.startTime && hour < b.startTime + b.duration && b.status !== 'CANCELLED');
                              const block = blockedTimes.find(bl => bl.room.name === room.name && bl.date === selectedCalendarDate && hour >= bl.startTime && hour < bl.startTime + bl.duration);
                              
                              let bgColor = 'var(--bg-secondary)';
                              let text = 'Libre';
                              let color = 'var(--text-secondary)';

                              if (booking) {
                                bgColor = booking.status === 'PENDING' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)';
                                color = booking.status === 'PENDING' ? '#ff9800' : '#4caf50';
                                text = booking.customerName;
                              } else if (block) {
                                bgColor = 'rgba(244, 67, 54, 0.2)';
                                color = '#f44336';
                                text = block.reason || 'Bloqueado';
                              }

                              return (
                                <div key={hour} 
                                  onClick={() => {
                                    if (booking) openEditModal(booking);
                                  }}
                                  style={{ 
                                  padding: '10px', 
                                  backgroundColor: bgColor, 
                                  color: color, 
                                  borderRadius: '4px',
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  cursor: booking ? 'pointer' : 'default',
                                  border: booking ? '1px solid currentColor' : 'none'
                                }}>
                                  <strong>{hour}:00</strong>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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

      {/* Manual Booking Modal */}
      {showManualModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: '20px' }}>Crear Turno Manual</h2>
            <form onSubmit={handleManualCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select required className={styles.select} value={manualForm.roomId} onChange={e => setManualForm({...manualForm, roomId: e.target.value})}>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <input required type="date" className={styles.input} value={manualForm.date} onChange={e => setManualForm({...manualForm, date: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select required className={styles.select} style={{ flex: 1 }} value={manualForm.startTime} onChange={e => setManualForm({...manualForm, startTime: Number(e.target.value)})}>
                  {Array.from({length: 14}, (_, i) => i + 10).map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
                <select required className={styles.select} style={{ flex: 1 }} value={manualForm.duration} onChange={e => setManualForm({...manualForm, duration: Number(e.target.value)})}>
                  {[1,2,3,4,5,6,8,10,12].map(h => <option key={h} value={h}>{h}h</option>)}
                </select>
              </div>
              <input required type="text" placeholder="Nombre de la banda / cliente" className={styles.input} value={manualForm.customerName} onChange={e => setManualForm({...manualForm, customerName: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp" className={styles.input} value={manualForm.customerPhone} onChange={e => setManualForm({...manualForm, customerPhone: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Crear Turno</button>
                <button type="button" onClick={() => setShowManualModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details / Edit Modal */}
      {selectedBookingDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: '10px' }}>Detalles de la Reserva</h2>
            <div style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
              <p><strong>Sala:</strong> {selectedBookingDetails.room.name}</p>
              <p><strong>Total:</strong> ${selectedBookingDetails.totalPrice}</p>
              <p style={{ marginTop: '10px' }}>
                <strong>Estado:</strong>{' '}
                <span className={`${styles.status} ${styles[selectedBookingDetails.status.toLowerCase()]}`}>
                  {selectedBookingDetails.status}
                </span>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label>Fecha:</label>
                  <input type="date" className={styles.input} value={editDetailsForm.date} onChange={e => setEditDetailsForm({...editDetailsForm, date: e.target.value})} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label>Hora:</label>
                  <select className={styles.select} value={editDetailsForm.startTime} onChange={e => setEditDetailsForm({...editDetailsForm, startTime: Number(e.target.value)})}>
                    {Array.from({length: 14}, (_, i) => i + 10).map(h => <option key={h} value={h}>{h}:00</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label>Duración:</label>
                  <select className={styles.select} value={editDetailsForm.duration} onChange={e => setEditDetailsForm({...editDetailsForm, duration: Number(e.target.value)})}>
                    {[1,2,3,4,5,6,8,10,12].map(h => <option key={h} value={h}>{h}h</option>)}
                  </select>
                </div>
              </div>
              
              <label>Nombre Cliente:</label>
              <input className={styles.input} value={editDetailsForm.customerName} onChange={e => setEditDetailsForm({...editDetailsForm, customerName: e.target.value})} />
              <label>WhatsApp:</label>
              <input className={styles.input} value={editDetailsForm.customerPhone} onChange={e => setEditDetailsForm({...editDetailsForm, customerPhone: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={saveModalEdit} className="btn-primary" style={{ flex: '1 1 100%' }}>Guardar Cambios</button>
              
              {selectedBookingDetails.status === 'PENDING' && (
                <button onClick={() => confirmPendingBooking(selectedBookingDetails.id)} className="btn-secondary" style={{ flex: 1, backgroundColor: '#4caf50', borderColor: '#4caf50', color: 'white' }}>Confirmar Pago</button>
              )}
              
              {selectedBookingDetails.status !== 'CANCELLED' && (
                <button onClick={() => { cancelBooking(selectedBookingDetails.id); setSelectedBookingDetails(null); }} className="btn-secondary" style={{ flex: 1 }}>Cancelar Turno</button>
              )}
              
              <button onClick={() => setSelectedBookingDetails(null)} className="btn-secondary" style={{ flex: 1, borderColor: '#888', color: '#888' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
