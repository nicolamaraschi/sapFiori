sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("project1.controller.View1", {

		// Funzione di inizializzazione del controller
		onInit: function () {
			// Crea un modello JSON per i prodotti
			var oProductsModel = new JSONModel();
			this.getView().setModel(oProductsModel, "productsModel");
			// Legge i dati dei prodotti
			this._onRead();
		},

		// Funzione per leggere i dati dei prodotti dal servizio OData
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

		// Funzione per navigare alla vista di dettaglio del prodotto
		onNavToDetail: function(oEvent) {
			const oItem = oEvent.getSource();
			const oContext = oItem.getBindingContext("productsModel");
			const sProductId = oContext.getProperty("ProductID");

			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail", {
				productID: sProductId 
			});
		},

		// Funzione di ricerca dei prodotti
		onSearch: function (oEvent) {
			var aFilters = [];
			// Ottiene il valore dalla search field
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				// Crea un filtro per il nome del prodotto (non case-sensitive)
				var oFilter = new Filter({
					path: "ProductName",
					operator: FilterOperator.Contains,
					value1: sQuery,
					caseSensitive: false
				});
				aFilters.push(oFilter);
			}

			// Applica il filtro alla tabella
			var oTable = this.byId("productsTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters);

			// Controlla subito dopo il filtro se ci sono righe visibili
			// Usiamo un timeout per assicurarci che il rendering della tabella sia completato
			setTimeout(function () {
				if (oBinding.getLength() === 0) {
					MessageBox.information("Nessun prodotto trovato.");
				}
			}, 0);
		},

		// Funzione per aprire il dialogo di ordinamento
		onSort: function () {
			this._openViewSettingsDialog("Sort");
		},

		// Funzione per aprire il dialogo di raggruppamento
		onGroup: function () {
			this._openViewSettingsDialog("Group");
		},

		// Funzione interna per aprire il ViewSettingsDialog
		_openViewSettingsDialog: function (sDialogTab) {
			var oView = this.getView();

			// Carica il frammento del dialogo se non è già stato caricato
			if (!this.byId("viewSettingsDialog")) {
				sap.ui.core.Fragment.load({
					id: oView.getId(),
					name: "project1.view.SortAndGroupDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open(sDialogTab);
				});
			} else {
				this.byId("viewSettingsDialog").open(sDialogTab);
			}
		},

		// Funzione per applicare le impostazioni di ordinamento e raggruppamento
		onConfirmViewSettings: function (oEvent) {
			var aSorters = [];
			var oBinding = this.byId("productsTable").getBinding("items");
			var mParams = oEvent.getParameters();

			// Applica il raggruppamento se selezionato
			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var oGroup = new Sorter(sPath, bDescending, true);
				aSorters.push(oGroup);
			}

			// Applica l'ordinamento
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			
			oBinding.sort(aSorters);
		}
	});
});