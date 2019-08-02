function AccountSecurityController(){	this.doInit  =  function(component, event, helper) {

        helper.fetchEmails(component);   
    },
	this.sendEmail  =  function(component, event, helper) {

        helper.sendEmail(component);
    },
	this.doVerification  =  function(component, event, helper) {

        helper.doVerification(component);
    },
	this.handleCancel  =  function(component, event, helper) {

        helper.close(component);
    },
	this.toggleOpen  =  function(component, event, helper) {

        component.set("v.isOpen", !component.get("v.isOpen"));
    },
	this.onSelect  =  function(component, event, helper) {

        helper.onSelect(component, event);
        var sendEmail = component.find("send-email");
        sendEmail.set("v.disabled" , false);
        component.set("v.isHistoryEmail", false);
    },
	this.onSentEmail  =  function(component, event, helper) {

        component.set("v.failedEmailObj", {});
        helper.onSentEmail(component);
    },
	this.onChangeEmails  =  function(component, event, helper) {

        const validEmails = component.get("v.emails").filter((e)=>!e.isSuspicious);     
        if(validEmails.length == 0){
            component.set("v.isEmailToValidate", false);
        }else if(validEmails.length == 1){
            component.set("v.isLastEmailToValidate", true);
        }            
    },
	this.onHistorySelect =  function(component, event, helper) {

        var emails = component.get("v.emails");
        var sendEmail = component.find("send-email");
        var currentSelection = component.get("v.selectedHistoryEmail");
        emails.forEach(function(e){
            e.isSelected = false;
        })
        component.set("v.isHistoryEmail", true);
        if(currentSelection != ""){
            sendEmail.set("v.disabled" , false);
        }else{
            sendEmail.set("v.disabled" , true);
        }
    },
	this.toggleDisable =  function(component, event, helper) {

        var currentSelection = component.get("v.selectedHistoryEmail");
        var sendEmail = component.find("send-email");
        if(currentSelection != ""){
            sendEmail.set("v.disabled" , false);
        }else{
            sendEmail.set("v.disabled" , true);
        }
    },
}
module.exports = new AccountSecurityController();
