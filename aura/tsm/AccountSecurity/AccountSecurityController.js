({
    doInit : function(component, event, helper) {
        helper.fetchEmails(component);   
    },
    sendEmail : function(component, event, helper) {
        helper.sendEmail(component);
    },
    doVerification : function(component, event, helper) {
        helper.doVerification(component);
    },
    handleCancel : function(component, event, helper) {
        helper.close(component);
    },
    toggleOpen : function(component, event, helper) {
        component.set("v.isOpen", !component.get("v.isOpen"));
    },
    onSelect : function(component, event, helper) {        
        helper.onSelect(component, event);
        //Setting disable false by default
        var sendEmail = component.find("send-email");
        sendEmail.set("v.disabled" , false);
        component.set("v.isHistoryEmail", false);
    },
    onSentEmail : function(component, event, helper) {
        // setting failedEmailObj to empty
        component.set("v.failedEmailObj", {});
        helper.onSentEmail(component);
    },
    onChangeEmails : function(component, event, helper) {
        const validEmails = component.get("v.emails").filter((e)=>!e.isSuspicious);     
        if(validEmails.length == 0){
            component.set("v.isEmailToValidate", false);
        }else if(validEmails.length == 1){
            component.set("v.isLastEmailToValidate", true);
        }            
    },
    //TSM - 1933 Adding logic for handling the history email select
    onHistorySelect: function(component, event, helper) {
        var emails = component.get("v.emails");
        var sendEmail = component.find("send-email");
        var currentSelection = component.get("v.selectedHistoryEmail");
        emails.forEach(function(e){
            e.isSelected = false;
        })
        component.set("v.isHistoryEmail", true);
        //Check for button for enable or disable
        if(currentSelection != ""){
            sendEmail.set("v.disabled" , false);
        }else{
            sendEmail.set("v.disabled" , true);
        }
    },
    //TSM - 1933 Adding logic for handling the button disable
    toggleDisable: function(component, event, helper) {
        var currentSelection = component.get("v.selectedHistoryEmail");
        var sendEmail = component.find("send-email");
        //Check for button for enable or disable
        if(currentSelection != ""){
            sendEmail.set("v.disabled" , false);
        }else{
            sendEmail.set("v.disabled" , true);
        }
    },
})