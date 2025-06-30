sap.ui.define([], function() {
    "use strict";

    // Ho sostituito 'key' con 'name' in ogni oggetto
    const aPropertyInfos = [{
        name: "rank",
        label: "Rank",
        path: "rank",
        dataType: "sap.ui.model.type.Integer"
    },{
        name: "name",
        label: "Name",
        path: "name",
        dataType: "sap.ui.model.type.String"
    },{
        name: "range",
        label: "Range",
        path: "range",
        dataType: "sap.ui.model.type.String"
    },{
        name: "parent_mountain",
        label: "Parent Mountain",
        path: "parent_mountain",
        dataType: "sap.ui.model.type.String"
    },{
        name: "first_ascent",
        label: "First Ascent",
        path: "first_ascent",
        dataType: "sap.ui.model.type.Integer"
    },{
        name: "countries",
        label: "Countries",
        path: "countries",
        dataType: "sap.ui.model.type.String"
    }];

    return aPropertyInfos;
});