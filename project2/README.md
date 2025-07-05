
# Progetto Fiori: Grafico dei Prezzi dei Prodotti

Questo documento è una guida completa all'applicazione "grafico", che visualizza i prezzi dei prodotti dal servizio OData di Northwind utilizzando un grafico a colonne. Vengono analizzati tutti i passaggi chiave: dalla risoluzione dei problemi di configurazione iniziali all'implementazione del grafico.

## Indice

1.  [Risoluzione dei Problemi di Avvio: SAPUI5 vs OpenUI5](https://www.google.com/search?q=%231-risoluzione-dei-problemi-di-avvio-sapui5-vs-openui5)
2.  [Configurazione della Fonte Dati (OData)](https://www.google.com/search?q=%232-configurazione-della-fonte-dati-odata)
3.  [Implementazione del Grafico (`View1.view.xml`)](https://www.google.com/search?q=%233-implementazione-del-grafico-view1viewxml)
4.  [Come Funziona il Data Binding](https://www.google.com/search?q=%234-come-funziona-il-data-binding)
5.  [Logica del Controller](https://www.google.com/search?q=%235-logica-del-controller)
6.  [Come Avviare il Progetto](https://www.google.com/search?q=%236-come-avviare-il-progetto)

-----

### 1\. Risoluzione dei Problemi di Avvio: SAPUI5 vs OpenUI5

Durante lo sviluppo iniziale, abbiamo incontrato un errore critico: `failed to load 'sap/viz/library.js'`.

#### Il Problema

L'applicazione tentava di scaricare le librerie necessarie per i grafici (`sap.viz`) da **`openui5.hana.ondemand.com`**. Questo falliva perché:

  * **OpenUI5** è la versione open-source di UI5 e contiene solo le librerie di base.
  * **SAPUI5** è la versione completa, proprietaria di SAP, che include librerie avanzate come `sap.viz` per i grafici.

L'errore era causato da una configurazione nel file `index.html` che forzava l'uso di OpenUI5, ignorando le impostazioni del nostro server di sviluppo locale.

#### La Soluzione

La soluzione è stata applicata in due file chiave per forzare l'uso del set di librerie corretto (SAPUI5):

**A. `webapp/index.html`:**
Abbiamo modificato il tag `<script>` di bootstrap per usare un **percorso relativo**. In questo modo, il browser chiede le librerie al nostro server locale invece di andare direttamente su internet.

```html
<script id="sap-ui-bootstrap"
    src="/resources/sap-ui-core.js" ... >
</script>
```

**B. `ui5.yaml`:**
Abbiamo configurato il server locale per agire da "proxy". Quando riceve una richiesta per le librerie, le va a prendere dalla fonte corretta di SAPUI5.

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://ui5.sap.com # <-- URL corretto per SAPUI5
```

Questa combinazione ha risolto il problema, permettendo all'app di caricare la libreria `sap.viz` e di renderizzare il grafico.

-----

### 2\. Configurazione della Fonte Dati (OData)

Per ottenere i dati dei prodotti, l'applicazione si connette al servizio OData di Northwind. La configurazione avviene nel file `webapp/manifest.json`.

  * **`dataSources`**: Qui definiamo la fonte dei nostri dati. `mainService` punta a `/v3/northwind/northwind.svc/`. Il percorso `/v3` viene intercettato dal nostro server locale (`ui5.yaml`) che lo reindirizza al vero servizio online, evitando problemi di CORS.

  * **`models`**: Qui istanziamo il modello dati. Il modello di default (identificato da `""`) viene collegato alla nostra `dataSource`, rendendo i dati disponibili in tutta l'applicazione.

-----

### 3\. Implementazione del Grafico (`View1.view.xml`)

La vista principale non usa una tabella, ma un controllo `VizFrame` della libreria `sap.viz` per mostrare i dati in modo visuale.

**Codice Chiave in `View1.view.xml`:**

```xml
<viz:VizFrame
    id="idVizFrame"
    vizType='column'
    width="100%"
    height="100%">
    <viz:dataset>
        <viz.data:FlattenedDataset data="{/Products}">
            <viz.data:dimensions>
                <viz.data:DimensionDefinition name="Product" value="{ProductName}" />
            </viz.data:dimensions>
            <viz.data:measures>
                <viz.data:MeasureDefinition name="Price" value="{UnitPrice}" />
            </viz.data:measures>
        </viz.data:FlattenedDataset>
    </viz:dataset>

    <viz:feeds>
        <viz.feeds:FeedItem uid="valueAxis" type="Measure" values="Price" />
        <viz.feeds:FeedItem uid="categoryAxis" type="Dimension" values="Product" />
    </viz:feeds>
</viz:VizFrame>
```

**Spiegazione:**

  * **`viz:VizFrame`**: È il componente che disegna il grafico. Con `vizType='column'` gli diciamo di creare un grafico a colonne.
  * **`dataset`**: È il contenitore dei dati. `FlattenedDataset` è il tipo più comune e lo colleghiamo alla nostra collezione di dati con `data="{/Products}"`.
  * **`dimensions`**: Rappresentano le categorie del nostro grafico, i dati che vanno sull'asse orizzontale (l'asse X). In questo caso, ogni **nome del prodotto** (`ProductName`) è una dimensione.
  * **`measures`**: Rappresentano i valori numerici che determinano l'altezza delle colonne (l'asse Y). Per noi, questa è il **prezzo unitario** (`UnitPrice`).
  * **`feeds`**: Sono le "istruzioni" che dicono al `VizFrame` come usare le dimensioni e le misure che abbiamo definito. Mappiamo la nostra misura "Price" all'asse dei valori (`valueAxis`) e la nostra dimensione "Product" all'asse delle categorie (`categoryAxis`).

-----

### 4\. Come Funziona il Data Binding

Il **Data Binding** è il cuore di SAPUI5 e permette di collegare i dati alla UI in modo dichiarativo.

1.  Il `VizFrame` è collegato all'intera collezione `/Products` tramite l'attributo `data` nel `FlattenedDataset`.
2.  SAPUI5 esegue automaticamente una richiesta GET al servizio OData per recuperare i dati dei prodotti.
3.  Per ogni prodotto ricevuto, il `VizFrame` usa le proprietà specificate nel binding:
      * `value="{ProductName}"` prende il nome del prodotto per l'asse delle categorie.
      * `value="{UnitPrice}"` prende il prezzo per l'asse dei valori.

Se il grafico non mostrasse i dati, il primo controllo da fare sarebbe verificare che i nomi delle proprietà (`ProductName`, `UnitPrice`) corrispondano esattamente a quelli restituiti dal servizio OData.

-----

### 5\. Logica del Controller

Per questa vista, il controller (`webapp/controller/View1.controller.js`) è estremamente semplice. Contiene solo la funzione `onInit`, che al momento è vuota. Questo perché tutta la logica di creazione e data binding del grafico è gestita in modo **dichiarativo** direttamente nel file `.view.xml`, rendendo il codice più pulito e facile da leggere.

-----

### 6\. Come Avviare il Progetto

Per eseguire l'applicazione in locale, segui questi passaggi dal terminale, nella cartella principale del progetto:

1.  **Installa le dipendenze** (da fare solo la prima volta):

    ```bash
    npm install
    ```

2.  **Avvia il server di sviluppo**:

    ```bash
    npm run start
    ```

Questo aprirà automaticamente l'applicazione nel tuo browser predefinito all'indirizzo `http://localhost:8080`.