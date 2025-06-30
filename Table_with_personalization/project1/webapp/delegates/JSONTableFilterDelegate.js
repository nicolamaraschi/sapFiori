sap.ui.define([
    "sap/ui/mdc/FilterBarDelegate"
], function (FilterBarDelegate) {
	"use strict";
	const JSONTableFilterDelegate = Object.assign({}, FilterBarDelegate);
	JSONTableFilterDelegate.fetchProperties = async () => [];
	return JSONTableFilterDelegate;
});