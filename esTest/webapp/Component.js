sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "project1/model/models" // Rimuovi se non usi altro da models.js
], function (UIComponent, Device, models) { 
    "use strict";

    return UIComponent.extend("project1.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model -- MODO CORRETTO
            const oDeviceModel = new sap.ui.model.json.JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");
        }
    });
});