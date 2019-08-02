({
	doInit : function(component, event, helper) {
		helper.fetchAccount(component);
    },
    openCreateModal : function(component, event, helper) {
        component.set("v.isOpenCreateModal", true);
    },
    handleCreateClick : function(component, event, helper) {        
        const allValid = component.find('field').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);

        if (allValid) {
            helper.createAccount(component);
        }else {
            Util.handleErrors(component, { getError: ()=> [{ message: "Please update the invalid form entries and try again." }] });     
        }
    }
})