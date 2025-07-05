sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("project2.controller.View1", {

		onInit: function () {
			var oProductsModel = new JSONModel();
			this.getView().setModel(oProductsModel, "productsModel");
			this._onRead();
		},

		_onRead: function () {
			var that = this;
			var oODataModel = this.getOwnerComponent().getModel();

			oODataModel.read("/Products", {
				success: function (data) {
					console.log("Data received from server:", data); // Verifica questo output nella console
					var oJSONModel = that.getView().getModel("productsModel");

					// --- MODIFICA CHIAVE ---
					// Inseriamo direttamente l'array di risultati nel modello, non l'oggetto intero.
					oJSONModel.setData(data.results);
                    // that.getView().getModel("productsModel").setData(data);
				},
				error: function (oError) {
					console.error("OData read error:", oError);
					MessageBox.error("Errore durante il caricamento dei dati.");
				}
			});
		}
	});
});