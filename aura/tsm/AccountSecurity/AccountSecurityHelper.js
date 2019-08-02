({
    fetchEmails : function(component){
        const nucleusId = component.get("v.nucleusId");
        const caseId = component.get("v.caseId");
        
        const action = component.get("c.getCustomerEmailsByNucleusId");        
        action.setParams({ nucleusId: nucleusId });
        
        component.set("v.isSpinner", true);
        action.setCallback(this, function(response) {
            const state = response.getState();            
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
                const emails = response.getReturnValue();
                component.set("v.emails", this.setAllowedForVerification( this.setRecommended( this.setTypeText( this.formatData( emails ) ) ) ) );
                //Getting the history emails
                this.getPriorEmailsOfCustomer(component);//TSM-1933
            }
            else {
                Util.handleErrors(component, response);
                //Getting the history emails
                this.getPriorEmailsOfCustomer(component);//TSM-1933
            }
        });
        $A.enqueueAction(action);        
    },
    sendEmail : function(component) {
        const nucleusId = component.get("v.nucleusId"),
            emailLocale = navigator.language;
			
        var caseId = component.get("v.caseId");
        var accountId = component.get("v.accountId");
        
        var toEmailId = "";
        if(caseId == ""){
            caseId = null;
        }
        if(component.get("v.isHistoryEmail")){
            toEmailId = component.get("v.selectedHistoryEmail");
        }else{
            var selectedEmailObj = component.get("v.emails").find((e)=>e.isSelected);
            toEmailId = selectedEmailObj.email;
            component.set("v.showPriorEmailContainer", false);
        }
    
        const action = component.get("c.sendEmailVerification"); 
        const params = { nucleusId: nucleusId, caseId: caseId, toEmailId: toEmailId, emailLocale: emailLocale, accountId: accountId };
        console.log('params', params);
        action.setParams(params);
        
        component.set("v.isSpinner", true);
        action.setCallback(this, function(response) {
            component.set("v.isSpinner", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.sentEmail", true);
            }
            else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);        
    },
    doVerification : function(component) {
        const verificationCode = component.get("v.verificationCode").trim(),
            sendKnowledgeArticle = component.get("v.sendArticle"),
            //setUpTFA = component.get("v.setUpTFA"),            
            nucleusId = component.get("v.nucleusId");
        
        var caseId = component.get("v.caseId");
        var accountId = component.get("v.accountId");

        var toEmailId = "";
        var selectedEmailObj = {};
        if(caseId == ""){
            caseId = null;
        }
        if(component.get("v.isHistoryEmail")){
            toEmailId = component.get("v.selectedHistoryEmail");
        }else{
            selectedEmailObj = component.get("v.emails").find((e)=>e.isSelected);
            toEmailId = selectedEmailObj.email;
        }
        
        let isValid = true;
        isValid = verificationCode ? true : false;
        
        if(isValid) {
            const action = component.get("c.validateVerificationCode");        
            action.setParams({ nucleusId: nucleusId, caseId: caseId, toEmailId: toEmailId, verificationCode: verificationCode, sendKnowledgeArticle: sendKnowledgeArticle, accountId: accountId});
            
            component.set("v.isSpinner", true);
            action.setCallback(this, function(response) {
                component.set("v.isSpinner", false);
                const state = response.getState();
                if (state === "SUCCESS") {
                    const status = JSON.parse(response.getReturnValue()).status;
                    if (status === "SUCCESS") {
                        const msg = `Account Verified with ${toEmailId}`;                       
                        Util.handleSuccess(component, msg);
                        this.verifyEmail(component); // TSM-1931
                        // fire compoenent event
                        // TSM-3598 - Adding condition for prior email verification
                        if(component.get("v.isHistoryEmail")){
                            selectedEmailObj.email = component.get("v.selectedHistoryEmail");
                            component.getEvent("onVerification").setParams({emailObj: selectedEmailObj}).fire();
                        }else{                            
                            component.getEvent("onVerification").setParams({emailObj: selectedEmailObj}).fire();
                        }
                        
                        this.close(component);
                    }else {
                        // clear text box
                        component.set("v.verificationCode", "");
                        // Reduce Number of Attempt
                        component.set("v.numberOfAttemptLeft", component.get("v.numberOfAttemptLeft")-1);
                        component.set("v.sendArticle", false);
                        if(component.get("v.numberOfAttemptLeft") <= 0){
                            this.handleVerificationFailure(component, selectedEmailObj);    
                        }
                    }
                }
                else {
                    Util.handleErrors(component, response);
                }
            });
            $A.enqueueAction(action);
        }else {
            console.log('verification code is mandatory');
        }
    },
    setAllowedForVerification : function(emails) {
        emails.forEach(function(e){            
            e.isAllowedForVerification = true;            
        });
        return emails;
    },
    setTypeText : function(emails) {
        emails.forEach(function(e){
            switch(e.type.toUpperCase()) {
                case 'PRIMARY' :
                    e.typeText = "Primary Email";
                    break;
                case 'SECONDARY' :
                    e.typeText = "Secondary Email";
                    break;
                case 'LAST_SECURE' :
                    e.typeText = "Last Secure";
                    break;
            };
        });
        return emails;
    },
    setRecommended : function(emails) {
        // clear existing Recommendation
        emails.forEach(function(e){
            e.isSelected = false;
            e.isRecommended = false;
        })
        // set Recommendation
        for (let index in emails) {
            const e = emails[index];
            if(!e.isSuspicious){
                e.isSelected = true;
                e.isRecommended = true;                
                break;    
            }            
        }
        return emails;
    },
    handleVerificationFailure : function(component, failedEmailObj) {
        // remove failedEmailObj
        const emails = component.get("v.emails").filter((e)=>e.email != failedEmailObj.email);        
        
        component.set("v.sentEmail", false);        
        component.set("v.emails", this.setAllowedForVerification(this.setRecommended(emails)));    
        component.set("v.failedEmailObj", failedEmailObj);
        component.set("v.verificationCode", "");
        component.set("v.numberOfAttemptLeft", 4);
        component.set("v.sendArticle", false);
    },
    onSelect : function(component, event) {
        const emails = component.get("v.emails"),
            selectedEmailObj = event.getSource().get('v.value');
        
        emails.forEach(function(e){
            if(e.email != selectedEmailObj.email){
                e.isSelected = false;
            }
        })
        component.set("v.emails", emails);
    },
    onSentEmail : function(component) {
        const emails = component.get("v.emails");
        emails.forEach(function(e){
            if(!e.isSelected){
                e.isAllowedForVerification = false
            }
        })
        component.set("v.emails", emails);
    },
    formatData : function(emails) {
        // remove deplicate & empty objects
        emails = emails.filter(function(obj, pos, ar) {
            return obj['email'] && ar.map(mapObj => mapObj['email']).indexOf(obj['email']) === pos;
        });
        
        emails.forEach(function(e){
            let tempDate = new Date(e.updatedOn);            
            if(isNaN(tempDate)) {
                tempDate = "";
            }
            e.updatedOn = tempDate;
        })
        return emails;
    },
    close: function(component) {
        component.set("v.isOpen", false);
    },
   // TSM-1931
    verifyEmail : function(component) {
        const caseId = component.get("v.caseId");
        var toEmailId = "";
        //TSM-3598 - Validating the component error
        if(component.get("v.isHistoryEmail")){
            toEmailId = component.get("v.selectedHistoryEmail");
        }else{
            var selectedEmailObj = component.get("v.emails").find((e)=>e.isSelected);
            toEmailId = selectedEmailObj.email;
        }
        
        var action = component.get("c.verifyEmailId");        
        action.setParams({caseID: caseId, userEmail: toEmailId, nucleusId: component.get("v.nucleusId")});
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
                component.set("v.isVerified",response.getReturnValue());
            }
            else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    // TSM-1933 - Adding function to get the history of emails
    getPriorEmailsOfCustomer : function(component) {
        var action = component.get("c.getPriorEmailsOfCustomer");        
        action.setParams({strNucleusId: component.get("v.nucleusId")});
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
                if(response.getReturnValue() != null){
                     this.formatHistoryEmail(component, response.getReturnValue());
                } else{
                    component.set("v.isSpinner", false);
                }
            }
            else {
                component.set("v.isSpinner", false);
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }, 
    //TSM-1933 - Formatting the history email into the combobox format and removing duplicates
    formatHistoryEmail: function(component, priorEmails) {
        var primaryEmailList = component.get("v.emails").map(Object => {
            if(Object.isSuspicious){
            component.set("v.isHistoryRecommended", true);
            component.set("v.isHistoryRecommendedRadio", true);
            }
            return Object.email;
        });
        priorEmails = priorEmails.filter(function(val) {
            return primaryEmailList.indexOf(val) == -1;
        });    
        
        var reformattedPriorityEmail = priorEmails.map(object =>{ 
            var retrunObject = {};
            retrunObject["label"] = object; 
            retrunObject["value"] = object;
            return retrunObject;
          });
        component.set("v.isSpinner", false);
        component.set("v.priorEmails", reformattedPriorityEmail);
    },
})