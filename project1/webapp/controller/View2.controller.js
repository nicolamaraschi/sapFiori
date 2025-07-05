sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("project1.controller.View2", {

		onInit: function () {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			const sProductId = oEvent.getParameter("arguments").productID;
			const oTable = this.byId("orderDetailsTable");
			const oBinding = oTable.getBinding("items");

			const oFilter = new Filter("ProductID", FilterOperator.EQ, parseInt(sProductId));

			oBinding.filter([oFilter]);
		},

		onNavBack: function () {
			window.history.go(-1);
		}
	});
});