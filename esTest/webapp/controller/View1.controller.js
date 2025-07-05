sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

       onNavToView2: function () {
           
            const sInputValue = this.byId("idView1Input").getValue();

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView2", {
                inputValue: sInputValue || "NessunDato"
            });
        }
    });
});