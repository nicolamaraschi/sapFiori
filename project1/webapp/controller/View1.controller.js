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
		},

		onSearch: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var oFilter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}

			var oTable = this.byId("productsTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters, "Application");

			oBinding.attachEventOnce("dataReceived", function () {
				if (oBinding.getLength() === 0) {
					MessageBox.information("No products found.");
				}
			});
		},

		onSort: function () {
			this._openViewSettingsDialog("Sort");
		},

		onGroup: function () {
			this._openViewSettingsDialog("Group");
		},

		_openViewSettingsDialog: function (sDialogTab) {
			var oView = this.getView();

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

		onConfirmViewSettings: function (oEvent) {
			var aSorters = [];
			var oBinding = this.byId("productsTable").getBinding("items");
			var mParams = oEvent.getParameters();

			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var oGroup = new sap.ui.model.Sorter(sPath, bDescending, true);
				aSorters.push(oGroup);
			}

			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			
			oBinding.sort(aSorters);
		}
	});
});