sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter, Fragment) {
	"use strict";

	return Controller.extend("filterbar.controller.View1", {

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

					// Populate unique values for MultiComboBoxes
					that._populateMultiComboBoxData(data.results);
				},
				error: function (oError) {
					MessageBox.error("Errore durante il caricamento dei dati.");
				}
			});
		},

		_populateMultiComboBoxData: function(aProducts) {
			var aUniqueProductNames = [];
			var aUniqueQuantities = [];
			var aUniquePrices = [];

			aProducts.forEach(function(oProduct) {
				if (aUniqueProductNames.indexOf(oProduct.ProductName) === -1) {
					aUniqueProductNames.push({key: oProduct.ProductName, text: oProduct.ProductName});
				}
				if (aUniqueQuantities.indexOf(oProduct.QuantityPerUnit) === -1) {
					aUniqueQuantities.push({key: oProduct.QuantityPerUnit, text: oProduct.QuantityPerUnit});
				}
				if (aUniquePrices.indexOf(oProduct.UnitPrice) === -1) {
					aUniquePrices.push({key: oProduct.UnitPrice, text: oProduct.UnitPrice});
				}
			});

			var oProductsModel = this.getView().getModel("productsModel");
			oProductsModel.setProperty("/UniqueProductNames", aUniqueProductNames);
			oProductsModel.setProperty("/UniqueQuantities", aUniqueQuantities);
			oProductsModel.setProperty("/UniquePrices", aUniquePrices);
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
			var oFilterBar = this.byId("filterbar");
			var oFilterGroupItems = oFilterBar.getFilterGroupItems();

			oFilterGroupItems.forEach(function(oFilterGroupItem) {
				var oControl = oFilterGroupItem.getControl();
				var sPath = oFilterGroupItem.getName();
				var aSelectedKeys = oControl.getSelectedKeys();

				if (aSelectedKeys && aSelectedKeys.length > 0) {
					var aFieldFilters = aSelectedKeys.map(function(sSelectedKey) {
						if (sPath === "UnitPrice" || sPath === "QuantityPerUnit") {
							return new Filter(sPath, FilterOperator.EQ, parseFloat(sSelectedKey));
						} else {
							return new Filter(sPath, FilterOperator.Contains, sSelectedKey);
						}
					});
					aFilters.push(new Filter({
						filters: aFieldFilters,
						and: false // OR condition for multiple selections within the same filter item
					}));
				}
			});

			// Applica il filtro alla tabella
			var oTable = this.byId("productsTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters);

			// Controlla subito dopo il filtro se ci sono righe visibili
			// Usiamo un timeout per assicurarsi che il rendering della tabella sia completato
			setTimeout(function () {
				if (oBinding.getLength() === 0) {
					MessageBox.information("Nessun prodotto trovato.");
				}
			}, 0);
		},

		onReset: function(oEvent) {
			var oFilterBar = this.byId("filterbar");
			var oFilterGroupItems = oFilterBar.getFilterGroupItems();

			oFilterGroupItems.forEach(function(oFilterGroupItem) {
				var oControl = oFilterGroupItem.getControl();
				// For MultiComboBox, clear selection
				if (oControl && oControl.setSelectedKeys) {
					oControl.setSelectedKeys([]);
				} else if (oControl && oControl.setValue) {
					oControl.setValue("");
				}
			});

			// Rimuovi i filtri dalla tabella
			var oTable = this.byId("productsTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter([]);
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
				Fragment.load({
					id: oView.getId(),
					name: "filterbar.view.SortAndGroupDialog",
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