sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel'
], function (Controller, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("smartchart.controller.View1", {

		onInit: function () {
			const sMockdataUrl = sap.ui.require.toUrl("smartchart/mockdata/");

			const oMockServer = new MockServer({
				rootUri: "/sapuicompsmartchart/"
			});

			this._oMockServer = oMockServer;

			oMockServer.simulate(sMockdataUrl + "metadata.xml", {
				sJsonFilesUrl: sMockdataUrl,
				bGenerateMissingAnnotations: true
			});

			oMockServer.start();

			const oModel = new ODataModel("/sapuicompsmartchart/", true);
			this.getView().setModel(oModel);

			const oSmartChart = this.getView().byId("smartChartGeneral");
			oSmartChart.attachInitialized(function () {
				oSmartChart.getChartAsync().then(function (oChart) {
					oChart.setVizProperties({
						categoryAxis: {
							layout: {
								maxHeight: 0.8
							}
						}
					});
				});
			});
		},

		onExit: function () {
			this._oMockServer.stop();
		}
	});
});