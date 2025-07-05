
# Guida al Progetto SAP Fiori: Dalla Tabella alla Navigazione

Questo documento è una guida tecnica che riassume i passaggi chiave per lo sviluppo di un'applicazione SAP Fiori "Master-Detail". L'applicazione si collega a un servizio OData esterno, visualizza una lista di prodotti e permette di navigare in una vista di dettaglio per visualizzare gli ordini associati a un prodotto specifico.

## Procedure Implementate

  * **Configurazione dell'Ambiente Locale**: Risoluzione dei problemi di CORS tramite un proxy locale.
  * **Connessione a un Servizio OData**: Definizione della fonte dati e del modello nel `manifest.json`.
  * **Creazione di una Tabella**: Visualizzazione di dati in una `sap.m.Table`.
  * **Strategia di Data Binding**: Utilizzo di un modello OData per la comunicazione e di un modello JSON per la visualizzazione.
  * **Navigazione tra Viste**: Configurazione del routing per passare da una vista master a una di dettaglio.
  * **Passaggio di Parametri**: Invio dell'ID del prodotto tramite l'URL.
  * **Filtraggio dei Dati**: Visualizzazione dei dati nella vista di dettaglio in base al parametro ricevuto.

-----

### 1\. Configurazione dell'Ambiente Locale (`ui5.yaml`)

Per permettere all'applicazione in esecuzione su `localhost` di comunicare con un servizio OData su un altro dominio (es. `services.odata.org`), abbiamo configurato un proxy.

**1. Installazione dei Middleware**: I proxy sono componenti aggiuntivi che devono essere installati nel progetto.

```bash
npm install --save-dev ui5-middleware-servestatic ui5-middleware-simpleproxy
```

**2. Configurazione del Proxy**: Il file `ui5.yaml` definisce le regole del proxy.

```yaml
# ui5.yaml
specVersion: '2.6'
metadata:
  name: project1
type: application
server:
  customMiddleware:
    - name: ui5-middleware-servestatic
      afterMiddleware: compression
      configuration:
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://openui5.hana.ondemand.com
    - name: ui5-middleware-simpleproxy
      afterMiddleware: compression
      mountPath: /v3
      configuration:
        baseUri: "https://services.odata.org/v3"
```

**3. Comando di Avvio**: Per usare questa configurazione ed evitare problemi con la cache, l'applicazione viene avviata con uno script specifico.

```bash
npm run start-noflp
```

-----

### 2\. Connessione al Servizio OData (`manifest.json`)

Il `manifest.json` è stato configurato per usare il proxy e per gestire correttamente la comunicazione con il servizio OData V3.

  * La **`dataSource`** punta al percorso locale del proxy (`/v3/...`).
  * Il **modello dati** di default viene configurato con `tokenHandling: false` e `json: true` per massimizzare la compatibilità.

<!-- end list -->

```json
// webapp/manifest.json
"sap.app": {
    "dataSources": {
        "mainService": {
            "uri": "/v3/northwind/northwind.svc/",
            "type": "OData"
        }
    }
},
"sap.ui5": {
    "models": {
        "": {
            "dataSource": "mainService",
            "settings": {
                "tokenHandling": false,
                "json": true
            }
        }
    }
}
```

-----

### 3\. Creazione della Tabella Principale (Master View)

Abbiamo adottato una strategia **ibrida**: leggiamo i dati con il modello OData ma li visualizziamo tramite un modello JSON locale per maggiore flessibilità.

  * **Controller (`View1.controller.js`)**: La funzione `_onRead` viene eseguita all'avvio. Usa il metodo `.read()` del modello OData. In caso di successo, i risultati (`data.results`) vengono inseriti in un modello JSON con nome (`productsModel`).

  * **Vista (`View1.view.xml`)**: La tabella è collegata al modello JSON (`items="{productsModel>/}"`). Poiché nell'app esiste anche un modello OData di default, è **fondamentale** specificare il nome del modello in ogni cella (`<Text text="{productsModel>ProductName}" />`) per evitare ambiguità.

-----

### 4\. Navigazione e Passaggio di Parametri

Per passare dalla lista prodotti al loro dettaglio, abbiamo usato il sistema di routing.

  * **Configurazione del Routing (`manifest.json`)**: Abbiamo definito una rotta `detail` con un pattern che accetta un parametro: `pattern: "products/{productID}"`.

  * **Avvio della Navigazione (da `View1.controller.js`)**: L'evento `press` sulla riga della tabella attiva la funzione `onNavToDetail`, che recupera il `ProductID` dal contesto di binding e chiama il router passandogli il parametro.

    ```javascript
    const sProductId = oContext.getProperty("ProductID");
    oRouter.navTo("detail", {
        productID: sProductId 
    });
    ```

  * **Ricezione del Parametro (in `View2.controller.js`)**: Il controller della vista di dettaglio si mette in ascolto sull'evento `patternMatched` della rotta `detail`. Quando l'evento scatta, la funzione `_onObjectMatched` legge il parametro `productID` dall'URL.

-----

### 5\. Creazione della Vista di Dettaglio

La vista di dettaglio mostra i dati filtrati in base al parametro ricevuto.

  * **Vista (`View2.view.xml`)**: Contiene una tabella collegata direttamente all'entità del modello OData che vogliamo visualizzare: `items="{/Order_Details}"`.

  * **Controller (`View2.controller.js`)**: Nella funzione `_onObjectMatched`, dopo aver ricevuto il `productID` dall'URL, creiamo un oggetto `Filter` e lo applichiamo al binding della tabella. In questo modo, la tabella richiederà al backend solo i dati che corrispondono al filtro, mostrando unicamente gli ordini per il prodotto selezionato.

    ```javascript
    // In _onObjectMatched:
    const sProductId = oEvent.getParameter("arguments").productID;
    const oTable = this.byId("orderDetailsTable");
    const oBinding = oTable.getBinding("items");

    const oFilter = new Filter("ProductID", FilterOperator.EQ, parseInt(sProductId));

    oBinding.filter([oFilter]);
    ```