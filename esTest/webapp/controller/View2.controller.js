sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("project1.controller.View2", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sInputValue = oEvent.getParameter("arguments").inputValue;

            
            this.byId("idView2Input").setValue(sInputValue);
        },

        onPageNavButtonPress: function () {
            window.history.go(-1);
        }
    });
});