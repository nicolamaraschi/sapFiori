sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("collegamentos4t.controller.View1", {
        onPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView2", {
                NumeroOrdine: oItem.getBindingContext().getProperty("NumeroOrdine")
            });
        }
    });
});