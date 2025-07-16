sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("collegamentos4t.controller.View1", {

        onInit: function () {
            var oSalesOrderModel = new JSONModel();
            this.getView().setModel(oSalesOrderModel, "salesOrderModel");
            this._onRead();
        },

        _onRead: function () {
            var that = this;
            var oODataModel = this.getOwnerComponent().getModel();
            oODataModel.read("/SalesOrderSet", {
                success: function (data) {
                    var oJSONModel = that.getView().getModel("salesOrderModel");
                    oJSONModel.setData(data.results);
                },
                error: function (oError) {
                    MessageBox.error("Errore durante il caricamento dei dati.");
                }
            });
        }
    });
});