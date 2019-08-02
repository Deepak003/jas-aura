({
	fetchAccount : function(component) {
		const action = component.get("c.getCaseAccountDetails");  
        action.setParams({
            strAccountId : component.get("v.accountId"),
            strCaseId : component.get("v.caseId")
        });
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                const storeResponse = response.getReturnValue();
                
                /*
                storeResponse.caseDetail.accountId = undefined;
                storeResponse.accountDetail.fullName = undefined
                storeResponse.caseDetail.caseIpAdress = '123.4.5.6'
                storeResponse.caseDetail.caseInteractionDetails.push({
                    aniCallerId: '(888) 87-8888'
                });
                */
                
                component.set('v.accountDetail', storeResponse.accountDetail || {});                
                component.set('v.caseDetail', storeResponse.caseDetail || {});
            }else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
	},
    createAccount : function(component) {
        const action = component.get("c.createSFAccount");
        action.setParams({ strData : JSON.stringify(component.get("v.newAccount")), strCaseId : component.get("v.caseId") });
        component.set("v.isSaving", true);
        action.setCallback(this, function(response) {
            component.set("v.isSaving", false);
            if (response.getState() === "SUCCESS") {
				Util.handleSuccess(component, response.getReturnValue());
                component.set("v.isOpenCreateModal", false);
                component.getEvent("onSaveAccount").fire();
            }else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})