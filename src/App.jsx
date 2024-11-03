import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [datiDocenti, setDatiDocenti] = useState(null)
  const [fotocopieUsate, setFotocopieUsate] = useState({})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    fetchDatiDocenti()
  }, [refresh])

  async function fetchDatiDocenti() {
    try {
      console.log('Fetching fresh data...');
      const { data, error } = await supabase
        .from('fotocopie_docenti')
        .select('*')
        .order('id')
      
      if (error) {
        console.error('Error fetching data:', error);
        alert('Errore nel caricamento dati: ' + error.message)
        return
      }

      if (data) {
        console.log('Setting new data:', data);
        setDatiDocenti([...data])
      }
    } catch (e) {
      console.error('Catch error:', e);
      alert('Errore: ' + e.message)
    }
  }

  async function inizializzaFotocopie() {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('fotocopie_docenti')
        .update({
          disponibile: 50,
          utilizzato: 0,
          ultimo_aggiornamento: new Date().toISOString()
        })
        .gte('id', 1)

      if (error) {
        alert('Si è verificato un errore: ' + error.message)
        return
      }

      setRefresh(prev => prev + 1)
      alert('Fotocopie inizializzate correttamente!')
    } catch (e) {
      alert('Errore: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInitClick = () => {
    setShowPasswordDialog(true)
    setPassword('')
    setPasswordError('')
  }

  const handlePasswordSubmit = () => {
    const ADMIN_PASSWORD = 'CDC1A2024'
    
    if (password === ADMIN_PASSWORD) {
      setShowPasswordDialog(false)
      inizializzaFotocopie()
      setPassword('')
      setPasswordError('')
    } else {
      setPasswordError('Password non corretta')
    }
  }

  async function aggiornaDatiDocente(id, nuoveFotocopie) {
    if (!nuoveFotocopie || nuoveFotocopie <= 0) {
      alert('Inserisci un numero valido di fotocopie')
      return
    }

    const docente = datiDocenti.find(d => d.id === id)
    if (!docente || nuoveFotocopie > docente.disponibile) {
      alert('Numero di fotocopie non valido o superiore a quelle disponibili')
      return
    }

    try {
      const { error } = await supabase
        .from('fotocopie_docenti')
        .update({ 
          disponibile: docente.disponibile - nuoveFotocopie,
          utilizzato: (docente.utilizzato || 0) + parseInt(nuoveFotocopie),
          ultimo_aggiornamento: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        alert('Errore durante l\'aggiornamento: ' + error.message)
        return
      }

      setRefresh(prev => prev + 1)
      setFotocopieUsate(prev => ({...prev, [id]: ''}))
    } catch (e) {
      alert('Errore: ' + e.message)
    }
  }
  return (
    <div className="container" style={{ 
      padding: '20px',
      backgroundColor: '#ffffff',
      color: '#000000',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#000000'
      }}>Gestione Fotocopie Docenti 1A</h1>
      
      <button 
        onClick={handleInitClick}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#cccccc' : '#007bff',
          color: '#ffffff',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'block',
          margin: '0 auto'
        }}
      >
        {loading ? 'Inizializzazione in corso...' : 'Inizializza Fotocopie (50 per docente)'}
      </button>

      {showPasswordDialog && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }} onClick={() => setShowPasswordDialog(false)} />
          
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '400px'  // Ridotto da 500px
          }}>
            <h2 style={{ marginBottom: '16px', color: '#000000' }}>Conferma Inizializzazione</h2>
            <p style={{ marginBottom: '16px', color: '#000000' }}>
              Questa azione resetterà il conteggio delle fotocopie per tutti i docenti.
              Inserisci la password di amministrazione per continuare.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="Inserisci password"
              style={{
                width: '80%',  // Ridotto da 100%
                padding: '8px',
                marginBottom: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'block',
                margin: '0 auto'
              }}
            />
            {passwordError && (
              <p style={{ color: '#ff0000', marginBottom: '8px' }}>{passwordError}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  setShowPasswordDialog(false)
                  setPassword('')
                  setPasswordError('')
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  cursor: 'pointer',
                  minWidth: '80px',
                  fontWeight: '500',
                  display: 'block'
                }}
              >
                Annulla
              </button>
              <button
                onClick={handlePasswordSubmit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '80px',
                  display: 'block'
                }}
              >
                Conferma
              </button>
            </div>
          </div>
        </>
      )}

      {datiDocenti ? (
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: '#ffffff', color: '#000000' }}>
            <thead>
              <tr>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>ID</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Nome</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Materia</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Disponibile</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Utilizzato</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Fotocopie da utilizzare</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Azione</th>
                <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Ultimo Aggiornamento</th>
              </tr>
            </thead>
            <tbody>
              {datiDocenti.map((docente) => (
                <tr key={docente.id}>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.id}</td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.nome}</td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.materia}</td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.disponibile || 0}</td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.utilizzato || 0}</td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>
                    <input
                      type="number"
                      min="1"
                      max={docente.disponibile}
                      value={fotocopieUsate[docente.id] || ''}
                      onChange={(e) => setFotocopieUsate({
                        ...fotocopieUsate,
                        [docente.id]: e.target.value
                      })}
                      style={{ 
                        width: '80px', 
                        padding: '4px',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: '1px solid #cccccc'
                      }}
                    />
                  </td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000', textAlign: 'center' }}>
                    <button
                      onClick={() => aggiornaDatiDocente(docente.id, parseInt(fotocopieUsate[docente.id] || 0))}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: '#ffffff',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Aggiorna
                    </button>
                  </td>
                  <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>
                    {new Date(docente.ultimo_aggiornamento).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                <td style={{ border: '2px solid #cccccc', padding: '8px', color: '#000000' }} colSpan="3">Totali</td>
                <td style={{ border: '2px solid #cccccc', padding: '8px', color: '#000000' }}>
                  {datiDocenti?.reduce((acc, doc) => acc + (doc.disponibile || 0), 0)}
                </td>
                <td style={{ border: '2px solid #cccccc', padding: '8px', color: '#000000' }}>
                  {datiDocenti?.reduce((acc, doc) => acc + (doc.utilizzato || 0), 0)}
                </td>
                <td style={{ border: '2px solid #cccccc', padding: '8px', color: '#000000' }} colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: '#000000' }}>Caricamento dati...</p>
      )}
    </div>
  )
}

export default App