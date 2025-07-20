sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, History, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("collegamentos4t.controller.View2", {

        onInit: function () {
            var oOrderItemsModel = new JSONModel({
                NumeroOrdine: "",
                results: []
            });
            this.getView().setModel(oOrderItemsModel, "orderItemsModel");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sNumeroOrdine = oEvent.getParameter("arguments").NumeroOrdine;
            
            // Formattazione del numero d'ordine a 10 cifre con zeri iniziali
            var sFormattedNumeroOrdine = sNumeroOrdine.padStart(10, '0');
            console.log("1. Numero Ordine ricevuto:", sNumeroOrdine, "-> Formattato:", sFormattedNumeroOrdine);

            var oODataModel = this.getOwnerComponent().getModel();
            var oItemsModel = this.getView().getModel("orderItemsModel");

            oItemsModel.setProperty("/NumeroOrdine", sFormattedNumeroOrdine);

            var oFilter = new Filter("NumeroOrdine", FilterOperator.EQ, sFormattedNumeroOrdine);
            console.log("2. Filtro creato:", oFilter);

            oODataModel.read("/SalesOrderItemSet", {
                filters: [oFilter],
                success: function (data) {
                    console.log("3. Dati ricevuti con successo:", data);
                    oItemsModel.setProperty("/results", data.results);
                },
                error: function (oError) {
                    console.error("4. Errore durante la chiamata OData:", oError);
                    oItemsModel.setProperty("/results", []);
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1", {}, true);
            }
        }
    });
});