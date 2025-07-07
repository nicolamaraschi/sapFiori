# Progetto Fiori: Bottone con Pop-up (`bottonepopup`)

Questo progetto è un'applicazione SAP Fiori di base che dimostra un concetto fondamentale: come aprire una finestra di dialogo (pop-up) al clic di un bottone.

L'applicazione è strutturata per mostrare le best practice di SAPUI5, includendo la separazione tra viste (interfaccia utente) e controller (logica), l'uso del routing e il caricamento "pigro" (lazy loading) dei componenti tramite i Fragment.

---

## Struttura del Progetto

Il progetto è organizzato nella seguente struttura di cartelle e file:

```
bottonepopup/
├── webapp/
│   ├── controller/
│   │   ├── App.controller.js   # Controller della cornice principale
│   │   └── View1.controller.js   # Logica della pagina con il bottone
│   ├── i18n/
│   │   └── i18n.properties     # Testi per la traduzione
│   ├── view/
│   │   ├── App.view.xml        # Vista della cornice principale (container)
│   │   ├── View1.view.xml      # Vista della pagina con il bottone
│   │   └── fragment/
│   │       └── HelloDialog.fragment.xml # Struttura del pop-up
│   ├── Component.js            # Punto di ingresso dell'app
│   └── manifest.json           # File di configurazione principale
└── ui5.yaml                    # Configurazione del server di sviluppo
```

---

## Come Funziona: Il Processo Spiegato Passo Passo

Ecco cosa succede dall'avvio dell'app fino alla chiusura del pop-up.

### 1. Avvio dell'Applicazione

1.  **`manifest.json`**: Al lancio, SAPUI5 legge questo file. Qui scopre che l'ID dell'app è `bottonepopup` e che la vista principale (root view) è `bottonepopup.view.App`.
2.  **Caricamento della Cornice**: Viene caricata la `App.view.xml`, che contiene solo un controllo `<App>`. Questo controllo agisce come un contenitore vuoto, pronto a ospitare le altre pagine.

### 2. Navigazione alla Prima Pagina (Routing)

1.  **`manifest.json` (sezione `routing`)**: La configurazione del routing dice a SAPUI5 di attivare subito la rotta `RouteView1`.
2.  **Caricamento della Vista**: Questa rotta ha come obiettivo `TargetView1`, che corrisponde alla vista `View1.view.xml`.
3.  **Visualizzazione**: La `View1.view.xml` (che contiene il nostro bottone) viene caricata e inserita dentro il controllo `<App>` della cornice. Ora l'utente vede la pagina con il bottone "Open Pop-up".

### 3. L'Utente Clicca il Bottone

1.  **Evento `press`**: Il bottone nella `View1.view.xml` ha l'attributo `press=".onOpenDialog"`. Questo significa: "Quando vieni cliccato, esegui la funzione `onOpenDialog` che si trova nel mio controller".
2.  **`View1.controller.js`**: Viene eseguita la funzione `onOpenDialog()`.

### 4. Apertura del Pop-up (Fragment)

1.  **Controllo Esistenza**: La prima cosa che fa la funzione è controllare se il pop-up (`helloDialog`) è già stato creato in passato, usando `this.byId("helloDialog")`. La prima volta, questo controllo fallisce (restituisce `undefined`).
2.  **Caricamento Asincrono**: Dato che il pop-up non esiste, viene usato `Fragment.load()`. Questa funzione carica in modo asincrono (senza bloccare l'interfaccia) il file `bottonepopup.view.fragment.HelloDialog.fragment.xml`.
3.  **Connessione alla Vista**: Una volta che il fragment è stato caricato con successo (`.then(...)`), il pop-up viene "collegato" alla vista principale (`oView.addDependent(oDialog)`). Questo è un passaggio fondamentale per assicurarsi che il pop-up erediti modelli e altre proprietà dalla vista.
4.  **Apertura**: Finalmente, `oDialog.open()` mostra il pop-up all'utente.
5.  **Clic Successivi**: Se l'utente chiude il pop-up e clicca di nuovo il bottone, il controllo `this.byId("helloDialog")` avrà successo. Il codice salterà il caricamento del fragment e chiamerà direttamente il metodo `.open()`, rendendo l'apertura istantanea.

### 5. Chiusura del Pop-up

1.  **Evento `press` nel Pop-up**: Il bottone "Chiudi" dentro `HelloDialog.fragment.xml` ha l'attributo `press=".onCloseDialog"`.
2.  **`View1.controller.js`**: Viene eseguita la funzione `onCloseDialog()`.
3.  **Chiusura**: Questa funzione recupera il pop-up tramite il suo ID (`this.byId("helloDialog")`) e chiama il metodo `.close()` per nasconderlo.