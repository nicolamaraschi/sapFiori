sap.ui.define([
    "sap/ui/mdc/TableDelegate",
    "sap/ui/mdc/table/Column",
    "sap/m/Text",
    "project1/delegates/JSONPropertyInfo"
], function (TableDelegate, Column, Text, JSONPropertyInfo) {
    "use strict";

    const JSONTableDelegate = Object.assign({}, TableDelegate);

    JSONTableDelegate.fetchProperties = function () {
        return Promise.resolve(JSONPropertyInfo);
    };

    JSONTableDelegate.addItem = function (oTable, sPropertyKey) {
        // Qui usiamo 'name' per trovare la proprietà corretta
        const oProperty = JSONPropertyInfo.find(p => p.name === sPropertyKey); 

        if (!oProperty) {
            return Promise.resolve(null);
        }

        const oColumn = new Column({
            id: oTable.getId() + "---col-" + sPropertyKey,
            // E qui usiamo 'name' di nuovo
            propertyKey: oProperty.name, 
            header: oProperty.label,
            template: new Text({
                text: "{mountains>" + oProperty.path + "}"
            })
        });

        return Promise.resolve(oColumn);
    };

    JSONTableDelegate.updateBindingInfo = function(oTable, oBindingInfo) {
        if (oBindingInfo) {
            oBindingInfo.model = "mountains";
            oBindingInfo.path = "/"; 
        }
    };

    return JSONTableDelegate;
});