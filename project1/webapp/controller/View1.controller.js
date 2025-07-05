sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("project1.controller.View1", {

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
					var oJSONModel = that.getView().getModel("productsModel");
					oJSONModel.setData(data.results);
				},
				error: function (oError) {
					MessageBox.error("Errore durante il caricamento dei dati.");
				}
			});
		},

		onNavToDetail: function(oEvent) {
			const oItem = oEvent.getSource();
			const oContext = oItem.getBindingContext("productsModel");
			const sProductId = oContext.getProperty("ProductID");

			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail", {
				productID: sProductId 
			});
		}
	});
});