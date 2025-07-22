sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("collegamentos4t.controller.CreateOrder", {

        onInit: function () {
            var oNewOrderModel = new JSONModel({
                TipoOrdine: "OR",
                CodiceCliente: "",
                ToItem: []
            });
            this.getView().setModel(oNewOrderModel, "newOrder");
        },

        onNavBack: function () {
            window.history.go(-1);
        },

        onAddItem: function () {
            var oModel = this.getView().getModel("newOrder");
            var aItems = oModel.getProperty("/ToItem");
            aItems.push({ Materiale: "", ValoreNettoItem: "0.00" });
            oModel.setProperty("/ToItem", aItems);
        },

        onDeleteItem: function (oEvent) {
            var oModel = this.getView().getModel("newOrder");
            var sPath = oEvent.getSource().getBindingContext("newOrder").getPath();
            var iIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
            var aItems = oModel.getProperty("/ToItem");
            aItems.splice(iIndex, 1);
            oModel.setProperty("/ToItem", aItems);
        },

        onCreateOrder: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var oNewOrderModel = this.getView().getModel("newOrder");
            var oNewOrderData = oNewOrderModel.getData();

            if (!oNewOrderData.TipoOrdine || !oNewOrderData.CodiceCliente) {
                MessageBox.error("Per favore, inserisci Tipo Ordine e Codice Cliente.");
                return;
            }

            var oPayload = {
                TipoOrdine: oNewOrderData.TipoOrdine,
                CodiceCliente: oNewOrderData.CodiceCliente,
                ToItem: oNewOrderData.ToItem
            };

            oModel.create("/SalesOrderSet", oPayload, {
                success: function (data) {
                    MessageBox.success("Ordine creato con successo!", {
                        onClose: function () {
                            that.onNavBack();
                        }
                    });
                },
                error: function (oError) {
                    MessageBox.error("Errore durante la creazione dell'ordine.");
                }
            });
        }
    });
});
