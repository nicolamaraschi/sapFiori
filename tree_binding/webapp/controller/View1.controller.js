sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("treebinding.controller.View1", {
        onInit() {
            const oViewModel = new JSONModel({
                busy: true
            });
            this.getView().setModel(oViewModel, "view");

            const oTreeModel = new JSONModel();
            this.getView().setModel(oTreeModel, "treeModel");

            this._loadData();
        },

        _loadData() {
            const oODataModel = this.getOwnerComponent().getModel();
            const oViewModel = this.getView().getModel("view");

            const readCategories = new Promise((resolve, reject) => {
                oODataModel.read("/Categories", {
                    success: (oData) => resolve(oData.results),
                    error: (oError) => reject(oError)
                });
            });

            const readProducts = new Promise((resolve, reject) => {
                oODataModel.read("/Products", {
                    success: (oData) => resolve(oData.results),
                    error: (oError) => reject(oError)
                });
            });

            Promise.all([readCategories, readProducts])
                .then(([aCategories, aProducts]) => {
                    const aTreeData = aCategories.map(oCategory => {
                        const oNode = {
                            Name: oCategory.CategoryName,
                            nodes: []
                        };

                        const aFilteredProducts = aProducts.filter(oProduct => oProduct.CategoryID === oCategory.CategoryID);
                        
                        oNode.nodes = aFilteredProducts.map(oProduct => ({
                            Name: oProduct.ProductName
                        }));

                        return oNode;
                    });

                    const oTreeModel = this.getView().getModel("treeModel");
                    oTreeModel.setData(aTreeData);
                    oViewModel.setProperty("/busy", false);
                })
                .catch(oError => {
                    console.error("Error loading data", oError);
                    oViewModel.setProperty("/busy", false);
                });
        }
    });
});
