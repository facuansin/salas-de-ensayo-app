'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Contraseña incorrecta. Intenta de nuevo.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Panel de Control</h1>
        <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>Ingresa la contraseña para acceder.</p>
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña..."
          style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: '#fff', fontSize: '1rem' }}
          autoFocus
        />
        
        {error && <p style={{ color: 'var(--accent-color)', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</p>}
        
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}
