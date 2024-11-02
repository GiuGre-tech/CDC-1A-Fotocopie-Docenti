import { useState, useEffect } da 'react'
import { supabase } da './supabase'
Importazione './App.css'

funzione App() {
 const [datiDocenti, setDatiDocenti] = useState(null)
 const [fotocopieUsate, setFotocopieUsate] = useState({})
 const [caricamento, setLoading] = useState(false)
 const [aggiorna, setRefresh] = useState(0)
 const [showPasswordDialog, setShowPasswordDialog] = useState(false)
 const [password, setPassword] = useState('')
 const [passwordError, setPasswordError] = useState('')

useEffect(() => {
 fetchDatiDocenti()
 }, [refresh])

funzione async fetchDatiDocenti() {
 prova {
 console.log('Recupero di nuovi dati...');
 const { dati, errore } = attendere supabase
 .from('fotocopie_docenti')
 .select('*')
 .order('id')
 
if (errore) {
 console.error('Errore durante il recupero dei dati:', errore);
 alert('Errore nel caricamento dati: ' + error.message)
 ritorno
 }

if (dati) {
 console.log('Impostazione di nuovi dati:', dati);
 setDatiDocenti([... dati])
 }
 } catch (e) {
 console.error('Cattura errore:', e);
 alert('Errore: ' + e.message)
 }
 }

funzione async inizializzaFotocopie() {
 setLoading(vero)
 prova {
 const { error } = attendere supabase
 .from('fotocopie_docenti')
 .update({
 disponibile: 50,
 utilizzato: 0,
 ultimo_aggiornamento: nuova Data().aISOString()
 })
 .gte('id', 1)

if (errore) {
 alert('Si è verificato un errore: ' + error.message)
 ritorno
 }

setRefresh(prev => prev + 1)
 alert('Fotocopie inizializzate correttamente!')
 } catch (e) {
 alert('Errore: ' + e.message)
 } infine {
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
 ritorno
 }

const docente = datiDocenti.find(d => d.id === id)
 if (!docente || nuoveFotocopie > docente.disponibile) {
 alert('Numero di fotocopie non valido o superiore a quelle disponibili')
 ritorno
 }

prova {
 const { error } = attendere supabase
 .from('fotocopie_docenti')
 .update({ 
 disponibile: docente.disponibile - nuoveFotocopie,
 utilizzato: (docente.utilizzato || 0) + parseInt(nuoveFotocopie),
 ultimo_aggiornamento: nuova Data().aISOString()
 })
 .eq('id', id)

if (errore) {
 alert('Errore durante l\'aggiornamento: ' + error.message)
 ritorno
 }

setRefresh(prev => prev + 1)
 setFotocopieUsate(prev => ({... prev, [id]: ''}))
 } catch (e) {
 alert('Errore: ' + e.message)
 }
 }
 ritorno (
 <div className="contenitore" stile={{ 
 imbottitura: '20px',
 backgroundColor: '#ffffff',
 colore: '#000000',
 minHeight: '100vh'
 }}>
 <stile h1={{ 
 textAlign: 'centro', 
 marginBottom: '20px',
 colore: '#000000'
 }}>Gestione Fotocopie Docenti</h1>
 
<pulsante 
 onClick={handleInitClick}
 disabilitato={caricamento}
 stile={{
 backgroundColor: caricamento in corso ? «#cccccc» : «#007bff»,
 colore: '#ffffff',
 imbottitura: '8px 16px',
 bordo: 'nessuno',
 borderRadius: '4px',
 marginBottom: '20px',
 cursore: caricamento ? 'non-allowed' : 'puntatore',
 visualizzazione: 'blocco',
 margine: '0 auto'
 }}
 >
 {caricamento in corso? 'Inizializzazione in corso...' : 'Inizializza Fotocopie (50 per docente)'}
 </pulsante>

{showPasswordDialog && (
 <>
 <div style={{
 posizione: «fissa»,
 superiore: 0,
 a sinistra: 0,
 destra: 0,
 in basso: 0,
 backgroundColor: 'rgba(0,0,0,0.5)',
 zIndex: 999
 }} onClick={() => setShowPasswordDialog(false)} />
 
<div style={{
 posizione: «fissa»,
 in alto: '50%',
 rimasto: '50%',
 transform: 'translate(-50%, -50%)',
 backgroundColor: '#ffffff',
 colore: '#000000',
 imbottitura: '20px',
 borderRadius: '8px',
 boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
 zIndex: 1000,
 larghezza: '90%',
 maxWidth: '500px'
 }}>
 <h2 style={{ marginBottom: '16px', colore: '#000000' }}>Conferma Inizializzazione</h2>
 <p style={{ marginBottom: '16px', colore: '#000000' }}>
 Questa azione resetterà il conteggio delle fotocopie per tutti i docenti.
 Inserisci la password di amministrazione per continuare.
 </p>
 <ingresso
 type="password"
 valore={password}
 onChange={(e) => {
 setPassword(e.target.value)
 setPasswordError('')
 }}
 placeholder="Inserisci password"
 stile={{
 larghezza: '100%',
 imbottitura: '8px',
 marginBottom: '8px',
 bordo: '1px solid #ccc',
 borderRadius: '4px',
 backgroundColor: '#ffffff',
 colore: '#000000'
 }}
 />
 {passwordError && (
 <p style={{ colore: '#ff0000', marginBottom: '8px' }}>{passwordError}</p>
 )}
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
 <pulsante
 onClick={() => setShowPasswordDialog(false)}
 stile={{
 imbottitura: '8px 16px',
 bordo: '1px solid #ccc',
 borderRadius: '4px',
 backgroundColor: '#ffffff',
 colore: '#000000',
 cursore: 'puntatore'
 }}
 >
 Annulla
 </pulsante>
 <pulsante
 onClick={handlePasswordSubmit}
 stile={{
 imbottitura: '8px 16px',
 backgroundColor: '#007bff',
 colore: '#ffffff',
 bordo: 'nessuno',
 borderRadius: '4px',
 cursore: 'puntatore'
 }}
 >
 Conferma
 </pulsante>
 </div>
 </div>
 </>
 )}

{datiDocenti ? (
 <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
 <stile tabella={{ borderCollapse: 'collapse', width: '100%', backgroundColor: '#ffffff', color: '#000000' }}>
 < testa>
 <tr>
 <° stile={{ bordo: '2px solid #cccccc', imbottitura: '8px', backgroundColor: '#f8f9fa', colore: '#000000' }}>ID</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Nome</th>
 <esimo stile={{ bordo: '2px solid #cccccc', imbottitura: '8px', backgroundColor: '#f8f9fa', colore: '#000000' }}>Materia</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Disponibile</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Utilizzato</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Fotocopie da utilizzare</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Azione</th>
 <th style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#f8f9fa', color: '#000000' }}>Ultimo Aggiornamento</th>
 </TR>
 </testa>
 < corpo>
 {datiDocenti.map((docente) => (
 <tr key={docente.id}>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', colore: '#000000' }}>{docente.id}</td>
 <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.nome}</td>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', colore: '#000000' }}>{docente.materia}</td>
 <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.disponibile || 0}</td>
 <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000' }}>{docente.utilizzato || 0}</td>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', colore: '#000000' }}>
 <ingresso
 type="numero"
 min="1"
 max={docente.disponibile}
 valore={fotocopieUsate[docente.id] || ''}
 onChange={(e) => setFotocopieUsate({
 ... fotocopieUsate,
 [docente.id]: e.valore.bersaglio
 })}
 stile={{ 
 larghezza: '80px', 
 imbottitura: '4px',
 backgroundColor: '#ffffff',
 colore: '#000000',
 Bordo: '1px solid #cccccc'
 }}
 />
 </TD>
 <td style={{ border: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', color: '#000000', textAlign: 'center' }}>
 <pulsante
 onClick={() => aggiornaDatiDocente(docente.id, parseInt(fotocopieUsate[docente.id] || 0))}
 stile={{
 backgroundColor: '#4CAF50',
 colore: '#ffffff',
 imbottitura: '5px 10px',
 bordo: 'nessuno',
 borderRadius: '3px',
 cursore: 'puntatore'
 }}
 >
 Aggiorna
 </pulsante>
 </TD>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', backgroundColor: '#ffffff', colore: '#000000' }}>
 {nuova data(docente.ultimo_aggiornamento).toLocaleDateString()}
 </TD>
 </TR>
 ))}
 <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'grassetto' }}>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', colore: '#000000' }} colSpan="3">Totali</td>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', colore: '#000000' }}>
 {datiDocenti?. reduce((acc, doc) => acc + (doc.disponibile || 0), 0)}
 </TD>
 <td style={{ bordo: '2px solid #cccccc', imbottitura: '8px', colore: '#000000' }}>
 {datiDocenti?. reduce((acc, doc) => acc + (doc.utilizzato || 0), 0)}
 </TD>
 <td style={{ bordo: '2px solid #cccccc', padding: '8px', colore: '#000000' }} colSpan="3"></td>
 </TR>
 </tbody>
 </tavolo>
 </div>
 ) : (
 <p style={{ color: '#000000' }}>Caricamento dati... </p>
 )}
 </div>
 )
}

esporta l'app predefinita