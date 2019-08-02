function AccountSummaryController(){	this.getAccountSummary =  function (component, event, helper) {

        helper.fetchAccountSummary(component, event, helper);
		helper.emailVerificationCheck(component, event, helper); // TSM-1931
		helper.getReasonCodes(component,event,helper);
        var toggleDialog = component.find('snapInDialog');
        var currentOpenSnap = [];
        for(var eachObject in toggleDialog) {
            currentOpenSnap[eachObject] = false;
        }
        component.set('v.isCurrentOpen', currentOpenSnap);
    },  
	this.handleRadioClick  =  function(component, event, helper){

     component.set('v.toTFAEmail', event.getSource().get('v.value'));
    },
	this.toggleDialogue  =  function(component, event, helper) {

      helper.toggleDialogue(component, event);
    },
	this.unShieldAccount =  function (component, event, helper) {

        helper.unShieldAccount(component, event, "unlockAccount");
    },
	this.shieldAccount =  function (component, event, helper) {

        helper.unShieldAccount(component, event, "lockAccount");
    },
	this.onChangeAOVEmailObj  =  function (component, event, helper) {

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
	this.toggleBackupcodes  =  function (component, event, helper) {

        var accountSnapDetails = component.get('v.accountSnapDetails');
        var toggleBackUpCodes = component.find('toggleBackUpCodes');
        if(accountSnapDetails.tfaResponse.status == 'DISABLED'){
            helper.changeVerificationStatus(component,"ENABLED");
            accountSnapDetails.tfaResponse.status = "ENABLED";
            $A.util.removeClass(toggleBackUpCodes, 'slds-hide');
        }else{
            helper.changeVerificationStatus(component,"DISABLED");
            accountSnapDetails.tfaResponse.status = 'DISABLED';
            $A.util.addClass(toggleBackUpCodes, 'slds-hide');
        }  
        component.set('v.accountSnapDetails', accountSnapDetails);
    },
	this.sendTFAEmail  =  function (component, event, helper) {

        helper.sendTfaSetupEmail(component, event);
    },
	this.generateCodes  =  function (component, event, helper) {

        helper.generateBackupCodes(component, event);
    },
	this.openCaseTab =  function(component, event, helper) {

        var openCaseTabEvent = component.getEvent("viewAllEvent");
        openCaseTabEvent.setParams({ "openCaseTab" : true }); 
        openCaseTabEvent.fire();
    },
	this.viewAccountNotes =  function(component, event, helper) {

        var openCaseTabEvent = component.getEvent("viewAccountEvent");
        openCaseTabEvent.setParams({ "openAccountTab" : true }); 
        openCaseTabEvent.fire();
    },
	this.viewLoginHistory =  function(component, event, helper) {

        var sessionOpenEvent = component.getEvent("sessionsOpenEvent");
        sessionOpenEvent.setParams({ "openSessionTab" : true }); 
        sessionOpenEvent.fire();
    },
	this.openResetModal =  function(component, event, helper) {

       component.set('v.isResetStatusOpen', true);
    },
	this.resetStatus =  function(component, event, helper) {

       helper.toggleDialogue(component, event);
       helper.setResetStatus(component, event, helper);
    },
	this.toggleShieldActionButton =  function(component, event, helper) {

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
	this.closeResetStatus =  function(component, event, helper){

        component.set('v.isResetStatusOpen', false);
    },
	this.cancel = function(component, event, helper){

		component.set("v.displayEdit",true); 
        component.set("v.disableSave",true);
    },
	this.setCurrentStatus =  function(component,event,helper){

        var currentVal = component.get("v.primaryState");
        console.log('currentVal--',currentVal);
        console.log('capitalized--',currentVal.charAt(0).toUpperCase() + currentVal.slice(1).toLowerCase());
        component.set("v.changedState",currentVal.charAt(0).toUpperCase() + currentVal.slice(1).toLowerCase());
        var currentStateValue=event.getParam("value");
        console.log('currentStateValue--',currentStateValue);
    },
	this.updateStatus = function(component,event,helper){

        var currentVal = component.get("v.primaryState");
        console.log('currentVal--',currentVal);
        component.set("v.updateStatusModal",true);
    },
	this.editAccountStatus =  function(component,event,helper){

        component.set("v.displayEdit",false);
        component.set("v.primaryState",event.getSource().get('v.value') );
        component.set("v.changedState",event.getSource().get('v.value').charAt(0).toUpperCase() + event.getSource().get('v.value').slice(1).toLowerCase());
        console.log('state label-->',event.getSource().get('v.label'));
		component.set("v.oldStatus",component.get("v.accountSnapDetails").status);
    },
	this.handleChange =  function(component,event,helper){

        var reasonValue = event.getParam("value");
        component.set("v.currentReason",reasonValue);
        if(reasonValue!=''){
            component.set("v.disableSave",false);
        }
        else{
            component.set("v.disableSave",true);
        }
    },
	this.updateAccountState =  function(component,event,helper){

        helper.updateStatus(component,event,helper);
        component.set("v.openSpinner",true);
    },
	this.closeUpdateModal =  function(component,event,helper){

        component.set("v.updateStatusModal",false);
    }
}
module.exports = new AccountSummaryController();
