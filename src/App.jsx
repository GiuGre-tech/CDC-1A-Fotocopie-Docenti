import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [datiDocenti, setDatiDocenti] = useState(null)
  const [fotocopieUsate, setFotocopieUsate] = useState({})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)

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
          utilizzato: 0
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
          utilizzato: (docente.utilizzato || 0) + parseInt(nuoveFotocopie)
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
    <div className="container" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Gestione Fotocopie Docenti</h1>
      
      <button 
        onClick={inizializzaFotocopie}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#cccccc' : '#007bff',
          color: 'white',
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

      {datiDocenti ? (
        <div>
          <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Nome</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Materia</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Disponibile</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Utilizzato</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Fotocopie da utilizzare</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Azione</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Ultimo Aggiornamento</th>
              </tr>
            </thead>
            <tbody>
              {datiDocenti.map((docente) => (
                <tr key={docente.id}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{docente.id}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{docente.nome}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{docente.materia}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{docente.disponibile || 0}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{docente.utilizzato || 0}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <input
                      type="number"
                      min="1"
                      max={docente.disponibile}
                      value={fotocopieUsate[docente.id] || ''}
                      onChange={(e) => setFotocopieUsate({
                        ...fotocopieUsate,
                        [docente.id]: e.target.value
                      })}
                      style={{ width: '80px', padding: '4px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={() => aggiornaDatiDocente(docente.id, parseInt(fotocopieUsate[docente.id] || 0))}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Aggiorna
                    </button>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {new Date(docente.ultimo_aggiornamento).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {/* Riga dei totali */}
              <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                <td style={{ border: '1px solid black', padding: '8px' }} colSpan="3">Totali</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {datiDocenti?.reduce((acc, doc) => acc + (doc.disponibile || 0), 0)}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {datiDocenti?.reduce((acc, doc) => acc + (doc.utilizzato || 0), 0)}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }} colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Caricamento dati...</p>
      )}
    </div>
  )
}

export default App