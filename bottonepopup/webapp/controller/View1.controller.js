sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox" // <-- IMPORTANTE: Aggiungiamo il modulo per i MessageBox
],
    function (Controller, Fragment, MessageBox) { // <-- Aggiungiamo MessageBox come parametro
        "use strict";

        return Controller.extend("bottonepopup.controller.View1", {

            // --- Logica esistente per il pop-up (Fragment) ---
            onOpenDialog: function () {
                var oView = this.getView();
                if (!this.byId("helloDialog")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "bottonepopup.view.fragment.HelloDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("helloDialog").open();
                }
            },

            onCloseDialog: function () {
                this.byId("helloDialog").close();
            },


            // --- NUOVA LOGICA PER I MESSAGEBOX ---

            // Mostra un MessageBox di tipo "Conferma"
            handleConfirmationMessageBoxPress: function () {
                MessageBox.confirm("Sei sicuro di voler procedere?", {
                    title: "Conferma",
                    onClose: function (sAction) {
                        // La variabile sAction contiene il testo del bottone cliccato ("OK" o "Cancel")
                        MessageBox.alert("Hai scelto: " + sAction);
                    }
                });
            },

            // Mostra un MessageBox di tipo "Errore"
            handleErrorMessageBoxPress: function () {
                MessageBox.error("Si è verificato un errore grave durante l'operazione.", {
                    title: "Errore"
                });
            },

            // Mostra un MessageBox di tipo "Avviso"
            handleWarningMessageBoxPress: function () {
                MessageBox.warning("Attenzione: stai per sovrascrivere i dati non salvati.", {
                    title: "Avviso"
                });
            },

            // Mostra un MessageBox di tipo "Successo"
            handleSuccessMessageBoxPress: function () {
                MessageBox.success("Operazione completata con successo!", {
                    title: "Successo"
                });
            },

            // Mostra un MessageBox di tipo "Informazione"
            handleInfoMessageBoxPress: function () {
                MessageBox.information("La manutenzione del server è prevista per le 22:00.", {
                    title: "Informazione"
                });
            }
        });
    });