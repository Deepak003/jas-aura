function AccountBasicInfoController(){	this.doInit =  function(component, event, helper) {

        helper.populateWWCEObjects(component, event, helper);
        helper.searchCustomerData(component, event, helper);     
        helper.setNamespaces(component,event,helper);
        var extData = component.get("v.externalData");
        extData["caseObj"]=component.get("v.caseObj");
        extData["nucleusId"]= component.get("v.nucleusId");
    },
	this.sendResetPasswordEmail  =  function(component,event,helper){

      helper.resetPasswordEmail(component,event);
    },
	this.toggleAccordian  =  function(component, event, helper) {

        helper.accordianToggle(component,event);  
    },
	this.toggleSocialEvent  =  function(component, event, helper) {

        var selectedTootTip = component.find(event.getSource().get('v.value'));
        if(event.getSource().get('v.type') =="button"){
            var toggleComponent = component.find(event.getSource().get('v.value')+'Toggle');
            toggleComponent.set('v.checked', toggleComponent.get("v.checked"));
        }else{
            event.getSource().set('v.checked', !event.getSource().get('v.checked'));
        }      
        $A.util.toggleClass(selectedTootTip, 'slds-show');  
        $A.util.toggleClass(selectedTootTip, 'slds-hide'); 
    },
	this.toggleAction =  function(component, event, helper) {

        var selectedAction = component.find(event.getSource().get('v.value'));
        selectedAction.set('v.checked', !selectedAction.get("v.checked"));
        var selectedToolTip = component.find(event.getSource().get('v.value').split('Toggle')[0]);
        $A.util.toggleClass(selectedToolTip, 'slds-show');  
        $A.util.toggleClass(selectedToolTip, 'slds-hide'); 
        component.set("v."+event.getSource().get('v.value').split('Toggle')[0],selectedAction.get("v.checked"));
        var modelComponent = component.get("v.accountDetailsModel");
        var globalOptin = modelComponent.globalOptin;
        var thirdPartyOptin = modelComponent.thirdPartyOptin; 
        var optTypeMessage = "";
        if(event.getSource().get('v.label') == 'Opt in'){
            optTypeMessage = "Opt in is successful!";
            if(event.getSource().get('v.value') == 'optInGlobalToggle'){
                globalOptin = "true";
            }else if(event.getSource().get('v.value') == 'optInThirdPartyToggle'){
                thirdPartyOptin = "true"
            }
        }else if(event.getSource().get('v.label') == 'Opt out'){
            optTypeMessage = "Opt out is successful!";
            if(event.getSource().get('v.value') == 'optInGlobalToggle'){
                globalOptin = "false";
            }else if(event.getSource().get('v.value') == 'optInThirdPartyToggle'){
                thirdPartyOptin = "false"
            }
        }  
        helper.optInSave(component, event, helper, globalOptin, thirdPartyOptin,optTypeMessage);
    },
	this.openEditView  =  function(component, event, helper) {

		var prevDob = component.get("v.accountDetailsModel.dob");
        component.set("v.prevDob",prevDob);
		var emailOldvalue=component.get("v.accountDetailsModel.email");
		var secondEmailOldvalue=component.get("v.accountDetailsModel.secondaryEmail");
        component.set("v.isOpen", false);
        component.set("v.isEdit", true);
		component.set("v.oldEmailValue", emailOldvalue);
		component.set("v.secondaryOldEmailValue", secondEmailOldvalue);
        helper.enableOrDisableSaveButton(component);  
		helper.getAgeRequirements(component,event,helper,false);		
    },
	this.accountButtonEvent  =  function(component, event, helper) {

        var phoneValiation = component.find("accountform")[8].get("v.validity");
        var primaryEmailValiation = component.find("accountform")[4].get("v.validity");
        var secondaryEmailValiation = component.find("accountform")[5].get("v.validity");
        var parentalEmailValiation = true;
        var dobValidation = component.find("accountform")[3].get("v.validity");
        if(component.find("accountform").length > 10){
            var parentalEmailValiation = component.find("accountform")[10].get("v.validity").valid;  
        }
        if(event.getSource().get('v.label')  == 'Save' && phoneValiation.valid && primaryEmailValiation.valid && secondaryEmailValiation.valid && parentalEmailValiation && dobValidation.valid){
            if(component.get("v.underAgeAccount") && (component.find("accountform")[10].get("v.value") == null || component.find("accountform")[10].get("v.value") == "")){
                var toastEvent = $A.get("e.force:showToast");
				var underAgeMessage ='You are changing this account to an underage account. Please add a parental email and try again.';
                toastEvent.setParams({
                    message: underAgeMessage,//"Age less than the allowed limit for the country specified. Please make sure to have Parental Email set and try again.",
                    type: "error"
                });
                toastEvent.fire();
            }// tsm 1911
			else if(component.get("v.underAgeAccount")==true&&component.find("accountform")[10].get("v.value")!=null&&component.get("v.prevDob")!=component.get("v.accountDetailsModel.dob")&&component.find("accountform")[3].reportValidity()){
                console.log('parent email has been given');
                component.set("v.isOpen", true);
                component.set("v.isEdit", false);
                component.set("v.openUnderAgeModal",true);
            }
			else{
                component.set("v.isOpen", true);
                component.set("v.isEdit", false);
				var newEmail=component.get("v.accountDetailsModel.email");
                var oldEmail=component.get("v.oldEmailValue");
				var newSecondEmail=component.get("v.accountDetailsModel.secondaryEmail");
                var oldSecondEmail=component.get("v.secondaryOldEmailValue");
				if(oldSecondEmail != null && newSecondEmail == ''){
                    helper.dltSecondaryEmail(component, event, helper);
                }                
                else if(oldSecondEmail != newSecondEmail){
                    helper.secondaryEmailVerification(component, event,helper);
                }
                else              
                    helper.saveCustomer(component, event, helper);
                if(oldEmail!=newEmail){
                    helper.updateEmailFlag(component, event, helper);
                }
            }
        }
        if(event.getSource().get('v.label')  == 'Cancel'){
            component.set("v.isOpen", true);
            component.set("v.isEdit", false);
            var oldModel=component.get("v.oldModel");
            var tempModel=JSON.parse(oldModel);
            component.set("v.accountDetailsModel", tempModel);
        }           
    },
	this.handleCountryChange  =  function(component, event, helper) {

        var selectedCountryValue = event.getParam("value");
        var currentModel = component.get("v.accountDetailsModel");
        currentModel.country = selectedCountryValue;
        component.set('v.accountInfoChange', true);    
    },
	this.handleLanguageChange  =  function(component, event, helper) {

        var selectedLanguageValue = event.getParam("value");
        var oldLanguageValue = component.get("v.oldLanguage");
        var currentLanguage = component.get("v.selectConfig");
        currentLanguage.language = oldLanguageValue;
        component.set("v.tempLanguage", selectedLanguageValue);
        component.set('v.accountInfoChange', true);    
    },
	this.toggleProcessing  =  function(component, event, helper) {

        var selectedTootTip = component.find('processingDataToggle');
        if(selectedTootTip.get('v.checked')){
            selectedTootTip.set('v.checked', false);
            var processingDataSection = component.find('processingData');
            $A.util.toggleClass(processingDataSection, 'slds-show');  
            $A.util.toggleClass(processingDataSection, 'slds-hide'); 
        }else{
            selectedTootTip.set('v.checked', true);
        }
    },
	this.stopProcessing  =  function(component, event, helper) {

        var selectedTootTip = component.find('processingDataToggle');
        if(event.getSource().get('v.label') == 'Cancel'){
            selectedTootTip.set('v.checked', false);
        }else{
            selectedTootTip.set('v.checked', true);
        }
        var processingDataSection = component.find('processingData');
        $A.util.toggleClass(processingDataSection, 'slds-show');  
        $A.util.toggleClass(processingDataSection, 'slds-hide'); 
    },
	this.callLinkedAccount =  function(component, event, helper){

        helper.getLinkedAccount(component, event, helper)
    },
	this.handleDobChange =  function(component, event, helper){

        helper.getAgeRequirements(component, event, helper,true);
        component.set('v.accountInfoChange', true); 
    },
	this.handleResetPasswordRadio  =  function(component, event, helper){

        component.set('v.toResetPasswordEmail', event.getSource().get('v.value'));
    },
	this.closeResetPassword =  function(component, event, helper){

        component.set('v.isResetPasswordOpen', false);
    },
	this.openResetPassword =  function(component, event, helper){

        component.set('v.isResetPasswordOpen', true);
    },
	this.closeTemporaryPassword =  function(component, event, helper){

        component.set('v.isSetTemporaryPasswordOpen', false);
    },
	this.openTemporaryPassword =  function(component, event, helper){

        component.set('v.isSetTemporaryPasswordOpen', true);
    },
	this.setTemporaryPasswordForUser =  function(component, event, helper){

        helper.setTemporaryPassword(component, helper);
    },
	this.toggleTempPasswordSubmit =  function(component, event, helper){

        var submitButton = component.find('temporaryPasswordSubmitButton');
        var tempPasswordText = component.find('temporaryPassword').get("v.validity").valid;
        if(!tempPasswordText){
            submitButton.set('v.disabled', true);
        }else{
            submitButton.set('v.disabled', false);
        }
    },
	this.handleAccountChange =  function(component, event, helper){

        component.set('v.accountInfoChange', true);
        helper.enableOrDisableSaveButton(component);
    },
	this.viewError =  function(component, event, helper){

        const originId = event.currentTarget.dataset.originid;
        const workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                focus: true,
                pageReference: {
                    "type": "standard__component",
                    "attributes": {
                        "componentName": "c__OriginError"
                    },                            
                    "state": {
                        originId: originId,
                        tabIcon: "utility:note",
                        tabTitle: "Origin Error Reports"
                    }
                }
            }).catch(console.log);
        }).catch(console.log);
    },
	this.keyCheck  =  function(component, event, helper){

        var codeValue = (component.find('verCodeS')).get("v.value");
        var verificationCode = component.get('v.verificationCode');
        if(codeValue != null){
            if(codeValue.length == verificationCode.length){                
                if(codeValue != verificationCode)
                    component.set('v.isCodeError', true);
                else{
                    component.set('v.isCodeError', false);
                    component.set('v.isSuccessDisable', false);
                }
            }
            else
                component.set('v.isSuccessDisable', true);
        }
    },
	this.updateSecondaryEmailData  =  function(component, event, helper){

        component.set("v.isEmailVerificationOpen", false);
        helper.updateSecondaryEmail(component, event, helper);
    },
	this.closeEmailVerification  =  function(component, event, helper){

        var toastEvent = $A.get("e.force:showToast");                                                        
        component.set('v.isEmailVerificationOpen', false);
        toastEvent.setParams({                   
            "message": "Secondary Email verification is Cancelled!",
            "type": "error"
        });
        toastEvent.fire();
        helper.saveCustomer(component, event, helper);
    },
	this.openAddPersonaModal =  function(component, event, helper){

        component.set("v.newPersonaModal",true);
        var name=component.find("addPersona")[0].get("v.value"),
            namespace = component.find("addPersona")[1].get("v.value");
        if(name!=''&&namespace!=''){
            component.set("v.addPersonaDisable",false);
        }else if(name==''||namespace==null){
            component.set("v.addPersonaDisable",true);
        }
    },
	this.closeAddPersonaModal =  function(component,event,helper){

        component.set("v.newPersonaModal",false);
        component.set("v.personaName",'');
        component.find("addPersona")[1].set("v.value",'');
    },
	this.addNewPersona  =  function(component,event,helper){

        console.log('inside submit add persona');
        component.set("v.openSpinner",true);
        helper.addPersona(component,event,helper);
    },
	this.setNameSpace =  function(component,event,helper){

      var namespace = event.getParam('value');
        component.set("v.namespace",namespace);
        var name=component.find("addPersona")[0].get("v.value"),
            namespace = component.find("addPersona")[1].get("v.value");
        if(name!=''&&namespace!=''){
            component.set("v.addPersonaDisable",false);
        }else if(name==''||namespace==null){
            component.set("v.addPersonaDisable",true);
        }
    },
	this.handlePersonaRefresh  =  function(component,event,helper){

    	helper.searchCustomerData(component,event,helper);
	},
	this.closeUnderageModal  =  function(component,event,helper){

		component.set("v.isOpen", false);
        component.set("v.isEdit", true);
        component.set("v.openUnderAgeModal",false);
    },
	this.updateParentEmail =  function(component,event,helper){

        component.set("v.openSpinner",true);
        component.set("v.parentEmailFlag",true);
        helper.saveCustomer(component, event, helper);
    },
	this.handleNewPersonaCheck = function(component,event,helper){

        var name=component.find("addPersona")[0].get("v.value"),
            namespace = component.find("addPersona")[1].get("v.value");
        if(name!=''&&namespace!=''){
            component.set("v.addPersonaDisable",false);
        }else if(name==''||namespace==null){
            component.set("v.addPersonaDisable",true);
        }
    }
}
module.exports = new AccountBasicInfoController();
