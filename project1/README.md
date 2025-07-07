
# Progetto Fiori: Elenco Funzionalità e Spiegazione

Questo documento descrive le funzionalità implementate in questa applicazione SAP Fiori e fornisce una spiegazione tecnica del loro funzionamento.

## Indice

1.  [Funzionalità Implementate](#1-funzionalità-implementate)
    *   [Ricerca Prodotti](#ricerca-prodotti)
    *   [Ordinamento e Raggruppamento](#ordinamento-e-raggruppamento)
2.  [Spiegazione Tecnica](#2-spiegazione-tecnica)
    *   [Risoluzione del Problema di Avvio (`ui5.yaml`)](#risoluzione-del-problema-di-avvio-ui5yaml)
    *   [Funzionamento dell'Applicazione (List-Detail)](#funzionamento-dellapplicazione-list-detail)

---

### 1. Funzionalità Implementate

#### Ricerca Prodotti

Nella vista principale (`View1`), è stata aggiunta una barra di ricerca (`sap.m.SearchField`) che consente di filtrare i prodotti in tempo reale.

*   **Come funziona:**
    1.  L'utente digita un testo nella barra di ricerca.
    2.  L'evento `search` viene gestito dalla funzione `onSearch` nel `View1.controller.js`.
    3.  La funzione crea un filtro (`sap.ui.model.Filter`) che cerca il testo digitato nel campo `ProductName` dei dati.
    4.  Il filtro viene applicato al binding della tabella, che si aggiorna mostrando solo i risultati corrispondenti.
    5.  Se la ricerca non produce risultati, viene mostrato un `MessageBox` informativo.

#### Ordinamento e Raggruppamento

Sono stati aggiunti due pulsanti alla barra della tabella per permettere l'ordinamento e il raggruppamento dei dati.

*   **Come funziona:**
    1.  L'utente clicca sul pulsante "Ordina" o "Raggruppa".
    2.  Viene aperto un dialogo (`sap.m.ViewSettingsDialog`) che mostra le opzioni disponibili. Le opzioni sono definite nel frammento `SortAndGroupDialog.fragment.xml`.
        *   **Ordinamento:** Per nome prodotto o prezzo.
        *   **Raggruppamento:** Per quantità per unità.
    3.  Quando l'utente conferma la selezione, la funzione `onConfirmViewSettings` nel controller crea degli oggetti `Sorter` di SAPUI5.
    4.  Questi sorter vengono applicati al binding della tabella, che riordina o raggruppa i dati come richiesto.

---

### 2. Spiegazione Tecnica

#### Risoluzione del Problema di Avvio (`ui5.yaml`)

Il problema iniziale di avvio (`Could not resolve npm package path undefined`) era dovuto a una configurazione mancante nel file `ui5.yaml`. È stato risolto aggiungendo il middleware `ui5-middleware-servestatic` per servire i file della cartella `webapp`, consentendo al server di trovare e caricare l'applicazione.

```yaml
# ui5.yaml
server:
  customMiddleware:
    # ... (proxy middleware)
    - name: ui5-middleware-servestatic
      afterMiddleware: ui5-middleware-simpleproxy
      mountPath: /
      configuration:
        rootPath: ./webapp
```

#### Funzionamento dell'Applicazione (List-Detail)

L'applicazione segue un pattern "List-Detail" gestito dal **Router** di SAPUI5, configurato in `webapp/manifest.json`.

*   **Routing:**
    *   La rotta di default (`""`) mostra `View1`.
    *   La rotta `Products/{productId}` mostra `View2`, passando l'ID del prodotto nell'URL.
*   **Data Binding:**
    *   **`View1` (Aggregation Binding):** La tabella è legata alla collezione `/Products` del modello OData, mostrando tutti i prodotti.
    *   **`View2` (Element Binding):** La vista di dettaglio è legata a un singolo prodotto (es. `/Products(1)`), mostrando solo i dati di quell'elemento. Il binding viene impostato nel controller `View2.controller.js` quando la rotta viene attivata.
*   **Avvio Semplificato:**
    *   Il comando `npm run start` è stato modificato nel `package.json` per avviare l'applicazione in modalità standalone (`index.html`) invece che nel Fiori Launchpad sandbox, semplificando il processo di sviluppo.