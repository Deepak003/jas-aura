({
    // Function called on initial component loading to get summary from apex
    getAccountSummary: function (component, event, helper) {
        helper.fetchAccountSummary(component, event, helper);
		helper.emailVerificationCheck(component, event, helper); // TSM-1931
		helper.getReasonCodes(component,event,helper);
        //Setting up the snap to false
        var toggleDialog = component.find('snapInDialog');
        var currentOpenSnap = [];
        for(var eachObject in toggleDialog) {
            currentOpenSnap[eachObject] = false;
        }
        component.set('v.isCurrentOpen', currentOpenSnap);
    },  
   handleRadioClick : function(component, event, helper){
     component.set('v.toTFAEmail', event.getSource().get('v.value'));
    },
    toggleDialogue : function(component, event, helper) {
     //Getting the toopTip menu value   
      helper.toggleDialogue(component, event);
    },
   // Function to trigger the un shield function
    unShieldAccount: function (component, event, helper) {
        helper.unShieldAccount(component, event, "unlockAccount");
    },
       // Function to trigger the un shield function
    shieldAccount: function (component, event, helper) {
        helper.unShieldAccount(component, event, "lockAccount");
    },
    onChangeAOVEmailObj : function (component, event, helper) {
        //const emailObj = component.get("v.aovEmailObj");
        const emailObj = event.getParam('emailObj');
        const accountSnapDetails = component.get('v.accountSnapDetails');
        if(accountSnapDetails && emailObj && emailObj.email) {
            accountSnapDetails.tfaDateFormatting = new Date();
            accountSnapDetails.aovVerifiedType = "with Email";
            accountSnapDetails.device = emailObj.email;
            accountSnapDetails.deviceType = "6 digit pin";
            accountSnapDetails.deviceIpGeo = "advisor input";
            accountSnapDetails.isAovVerified = true;
            component.set('v.accountSnapDetails', accountSnapDetails);
        }        
    },
    toggleBackupcodes : function (component, event, helper) {
        var accountSnapDetails = component.get('v.accountSnapDetails');
        var toggleBackUpCodes = component.find('toggleBackUpCodes');
        if(accountSnapDetails.tfaResponse.status == 'DISABLED'){
            //Calling the backend
            helper.changeVerificationStatus(component,"ENABLED");
            //Updating the front-end
            accountSnapDetails.tfaResponse.status = "ENABLED";
            $A.util.removeClass(toggleBackUpCodes, 'slds-hide');
        }else{
            //Calling the backend
            helper.changeVerificationStatus(component,"DISABLED");
            //Updating the front-end
            accountSnapDetails.tfaResponse.status = 'DISABLED';
            $A.util.addClass(toggleBackUpCodes, 'slds-hide');
        }  
        component.set('v.accountSnapDetails', accountSnapDetails);
    },
     sendTFAEmail : function (component, event, helper) {
        helper.sendTfaSetupEmail(component, event);
    },
    generateCodes : function (component, event, helper) {
        helper.generateBackupCodes(component, event);
    },
    openCaseTab: function(component, event, helper) {
        var openCaseTabEvent = component.getEvent("viewAllEvent");
        openCaseTabEvent.setParams({ "openCaseTab" : true }); 
        openCaseTabEvent.fire();
    },
    viewAccountNotes: function(component, event, helper) {
        var openCaseTabEvent = component.getEvent("viewAccountEvent");
        openCaseTabEvent.setParams({ "openAccountTab" : true }); 
        openCaseTabEvent.fire();
    },
    viewLoginHistory: function(component, event, helper) {
        var sessionOpenEvent = component.getEvent("sessionsOpenEvent");
        sessionOpenEvent.setParams({ "openSessionTab" : true }); 
        sessionOpenEvent.fire();
    },
    openResetModal: function(component, event, helper) {
       component.set('v.isResetStatusOpen', true);
    },
    resetStatus: function(component, event, helper) {
       helper.toggleDialogue(component, event);
       helper.setResetStatus(component, event, helper);
    },
    toggleShieldActionButton: function(component, event, helper) {
        var shieldText = component.find('shieldText').get("v.value");
        var isShielded = component.get('v.isShielded');
        if(shieldText != "" && !component.get("v.isCaseLinkedDisable")){
            if(isShielded){
                 var unShieldButton = component.find('unShieldButton');
                 unShieldButton.set('v.disabled', false);
            }else{
                 var shieldButton = component.find('shieldButton');
                 shieldButton.set('v.disabled', false);
            }
        }else{
           if(isShielded){
                 var unShieldButton = component.find('unShieldButton');
                 unShieldButton.set('v.disabled', true);
            }else{
                 var shieldButton = component.find('shieldButton');
                 shieldButton.set('v.disabled', true);
            }
        }
    },
	closeResetStatus: function(component, event, helper){
        component.set('v.isResetStatusOpen', false);
    },
	cancel:function(component, event, helper){
		component.set("v.displayEdit",true); 
        component.set("v.disableSave",true);
    },
	 setCurrentStatus: function(component,event,helper){
        var currentVal = component.get("v.primaryState");
        console.log('currentVal--',currentVal);
        console.log('capitalized--',currentVal.charAt(0).toUpperCase() + currentVal.slice(1).toLowerCase());
        component.set("v.changedState",currentVal.charAt(0).toUpperCase() + currentVal.slice(1).toLowerCase());
        var currentStateValue=event.getParam("value");
        console.log('currentStateValue--',currentStateValue);
    },
    updateStatus:function(component,event,helper){
        var currentVal = component.get("v.primaryState");
        console.log('currentVal--',currentVal);
        component.set("v.updateStatusModal",true);
        //call helper to send status
    },
	editAccountStatus: function(component,event,helper){
        component.set("v.displayEdit",false);
        component.set("v.primaryState",event.getSource().get('v.value') );
        
        component.set("v.changedState",event.getSource().get('v.value').charAt(0).toUpperCase() + event.getSource().get('v.value').slice(1).toLowerCase());
        console.log('state label-->',event.getSource().get('v.label'));
		component.set("v.oldStatus",component.get("v.accountSnapDetails").status);
        
    },
	//to enable and disable save button if reason is picked other than none
    handleChange: function(component,event,helper){
        var reasonValue = event.getParam("value");
        component.set("v.currentReason",reasonValue);
        if(reasonValue!=''){
            component.set("v.disableSave",false);
        }
        else{
            component.set("v.disableSave",true);
        }
    },
    updateAccountState: function(component,event,helper){
        helper.updateStatus(component,event,helper);
        component.set("v.openSpinner",true);
       
    },
    closeUpdateModal: function(component,event,helper){
        component.set("v.updateStatusModal",false);
    }
})