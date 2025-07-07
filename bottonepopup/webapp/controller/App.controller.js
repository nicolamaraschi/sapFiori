/*
 * Questo è il controller della vista "App.view.xml".
 * In applicazioni semplici come questa, spesso non ha logica
 * perché il suo unico scopo è quello di essere il contenitore
 * gestito dal routing.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("bottonepopup.controller.App", {
            onInit: function () {
                // Funzione eseguita all'inizializzazione del controller.
            }
        });
    });