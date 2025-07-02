## Introduzione a JavaScript Moderno (ES6+)

JavaScript si è evoluto enormemente negli ultimi anni. Le versioni moderne, a partire da ES6 (ECMAScript 2015), hanno introdotto funzionalità che rendono il codice più pulito, leggibile e potente.

### Caratteristiche Principali

Ecco alcune delle novità più importanti che ogni sviluppatore dovrebbe conoscere:

- **`let` e `const`**: Nuovi modi per dichiarare variabili, che hanno sostituito `var` nella maggior parte dei casi, offrendo uno scope a livello di blocco.
- **Arrow Functions**: Una sintassi più concisa per scrivere funzioni. Ad esempio `(a, b) => a + b;`.
- **Promises**: Un modo migliore per gestire operazioni asincrone, evitando il "callback hell".

### Esempio di Codice: Promises

Ecco come appare una semplice Promise per simulare il caricamento di dati.

```javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    // Simula una risposta positiva dopo 2 secondi
    resolve({ user: 'Mario Rossi', id: 1 });
  }, 2000);
});

fetchData
  .then(data => console.log('Dati ricevuti:', data))
  .catch(error => console.error('Errore:', error));
```

![alt text](https://www.discprofile.com/media/Graphics/NewHeaderImages2025/disc-styles-CS_1600.webp)