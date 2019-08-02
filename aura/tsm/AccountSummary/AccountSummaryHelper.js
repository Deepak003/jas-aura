({
    //gets account data from apex controller 
    fetchAccountSummary: function (component, event, helper) {       			      	 
        var accountSummary = component.get("v.accountSnapDetails");
        var accountBasicInfo = component.get("v.accountSummary");
        this.checkBackupCodes(component, accountSummary);
        //Formatting date
        if(accountSummary.tfaResponse.status != "Not Setup"){
                    component.set("v.accountSnapDetails.tfaDateFormatting", new Date(accountSummary.tfaResponse.lastModifiedDate));  
        }

        if (accountSummary.tfaResponse.codeType == 'APP') {
                    component.set("v.accVerificationType", 'App Authenticator Verification');
                    component.set("v.accVerificationData", '');
         } else if(accountSummary.tfaResponse.codeType == 'EMAIL') {
                    component.set("v.accVerificationType", 'Email Verification');
                    component.set("v.accVerificationData", accountSummary.tfaResponse.email);                    
         } else {
                    var phoneNumber = accountSummary.tfaResponse.phoneNumber + ' (' + accountSummary.tfaResponse.regionCode + ')';
                    component.set("v.accVerificationType", 'SMS Verification');
                    component.set("v.accVerificationData", phoneNumber);
           }
         component.set("v.toTFAEmail", accountBasicInfo.email);   
    },
	getReasonCodes:function(component,event,helper){
           //tsm3020/3021 reasons accountReasons
        var action=component.get("c.getAccountReasonCodes");
        action.setCallback(this,function(response){
            console.log('response of status--',response.getReturnValue());
            if(response.getReturnValue()!=null){
                var reasonCodesJson=response.getReturnValue();
                
                var jsonStr = reasonCodesJson;//JSON.stringify(reasonCodesJson);
                var parsedJson= JSON.parse(jsonStr); //parse the json sent frm apx
                var reasonCodesList = parsedJson.response.userReasonCodeList;//object
                var allAccountStatuses = parsedJson.response.userStatusesList;//object
                
                var accountStatuses=[];
                for(var i=0;i<allAccountStatuses.length;i++){
                    if(allAccountStatuses[i]=='ACTIVE'||allAccountStatuses[i]=='BANNED'||allAccountStatuses[i]=='DISABLED'||allAccountStatuses[i]=='DEACTIVATED'||allAccountStatuses[i]=='SUSPENDED'||allAccountStatuses[i]=='DELETED')
                        accountStatuses.push(allAccountStatuses[i]);
                }
                console.log('accountStatuses--',accountStatuses);
                //converting reaonCodes object to an array with label:'',value:'' 
                //label:removing capitals&'_' AND value as it is from json
                console.log('array of reasonCodes--',reasonCodesList);
                var reasonsList = Object.keys(reasonCodesList).map(function(key){
                    var key1 = reasonCodesList[key].charAt(0).toUpperCase() + reasonCodesList[key].slice(1).toLowerCase(); //capitalize starting letter and remove caps of other letters
                    var reasonLabelKey = key1.replace(/_/g, " "); //replacing underscores with spaces 
                    return {label: reasonLabelKey, value: reasonCodesList[key]}
                });
                //converting statuses to label,value
                var accountStatusList = Object.keys(accountStatuses).map(function(key){
                    
                    var statusLabelKey = accountStatuses[key].charAt(0).toUpperCase() + accountStatuses[key].slice(1).toLowerCase();
                    
                    return {label: statusLabelKey, value: accountStatuses[key]}
                });
                
                component.set("v.accountReasons",reasonsList);
                component.set("v.accountStatusOptions",accountStatusList);
            }
        });
        $A.enqueueAction(action);

    },
    // calculates total time (in years) spent as a customer of EA
    unShieldAccount: function (component, event, lockUnlockAction) {
        var action = component.get("c.lockUnlockAccountId"); 
        var nucleusId = component.get("v.nucleusId");	
		var caseId = component.get("{!v.caseId}");
        var reason = component.find('shieldText').get("v.value");
        var toastEvent = $A.get("e.force:showToast");
		action.setParams({
			nucleusId : nucleusId,
            action: lockUnlockAction,
			caseId: caseId,
            reason: reason,
            strAccountId: component.get("v.accountId")
		});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lockResponse = response.getReturnValue(); 
                var shieldText = component.find('shieldText').set("v.value","");
                if(lockUnlockAction != "lockAccount"){
                     component.set("v.isShielded", false);
                }else{
                     component.set("v.isShielded", true);
                }  
                var successMessage="";
                if(JSON.parse(lockResponse).response == 'Account Locked Successfully.'){
                    successMessage = 'Account Shielded';
                }else{
                    successMessage = 'Account Unshielded';
                }
                //Closing the popup
                var toggleDialog = component.find('snapInDialog');
                var isCurrentOpen = component.get('v.isCurrentOpen');
                $A.util.addClass(toggleDialog[4], 'slds-hide');
                isCurrentOpen[4] = false;
                //Adding success toast
                toastEvent.setParams({
    				message:successMessage,
    				type: "success"
				});
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    // Sends the TFA email to the customer
    sendTfaSetupEmail: function (component, event) {
        var action = component.get("c.sendTfaSetupEmail"); 
        var nucleusId = component.get("v.nucleusId");
        var toEmail = component.get("v.toTFAEmail");
		var caseId = component.get("{!v.caseId}");										  
		action.setParams({
			nucleusId : nucleusId,
            toEmailId: toEmail,
			caseId: caseId			  
		});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var tfaResponse = response.getReturnValue();    
            }
        });
        $A.enqueueAction(action);
    },
    checkBackupCodes: function (component, accountSummary) {
        var currentBackupCodesStatus = [];
        for (var i in accountSummary.tfaResponse.backupCodes) {
            currentBackupCodesStatus.push(accountSummary.tfaResponse.backupCodes[i].isExpired);
        }
        if (currentBackupCodesStatus.indexOf("N") > -1) {
            component.set("v.showGenerateCode", false);
        } else {
            component.set("v.showGenerateCode", true);
        }
    },
    generateBackupCodes : function (component) {
        var action = component.get("c.generateBackupCodes"); 
        var nucleusId = component.get("v.nucleusId");
        var accountId = component.get("v.accountId");
		var caseId = component.get("v.caseId");
		action.setParams({
            strCustomerId : nucleusId,
            strCaseId: caseId,
            strAccountId: accountId
		});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var generateCodeResponse = response.getReturnValue();
                var accountSummary = component.get("v.accountSnapDetails");
                accountSummary.tfaResponse = generateCodeResponse;
                component.set("v.accountSnapDetails", accountSummary);
                component.set("v.showGenerateCode", false);
            }
        });
        $A.enqueueAction(action);
    },
    setResetStatus : function (component) {
        var action = component.get("c.resetSecurityState"); 
        var nucleusId = component.get("v.nucleusId");
        var caseObj = component.get("v.caseObj");    
        var requestObject = {};
        
        requestObject.securityState = "";
        requestObject.customerId = nucleusId;
        requestObject.caseId = caseObj.Id;
        requestObject.AccountId = caseObj.AccountId;
        
        action.setParams({
            reqParams : requestObject
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                //getting the model
                var getSummaryComponent = component.get("v.accountSnapDetails");
                var getAccountSummary = component.get("v.accountSummary");
                //Changing the state
                getSummaryComponent.securityState   = 'GREEN';
                getAccountSummary.securityState   = 'GREEN';
                //Setting to the UI
                component.set("v.accountSnapDetails" , getSummaryComponent);
                component.set("v.accountSummary" , getAccountSummary);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": "Security state is reset successfully.",
                    "type": "success"
                });
                
                component.set('v.isResetStatusOpen', false);
                toastEvent.fire();
            }
            else{
                component.set("v.isResetStatusOpen", false);
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors[0] && errors[0].message) {
                    toastEvent.setParams({
                        "message": errors[0].message,
                         "type" : "error"
               		});
                } else {
                    toastEvent.setParams({
                        "message": "Security state reset is failed.",
                         "type" : "error"
               		});
                }
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
     formatTfaDate : function (component, currentDate) {
        var milliseconds = parseInt(new Date() - new Date(currentDate.toString())),
        seconds = parseInt((milliseconds / 1000) % 60),
        minutes = parseInt((milliseconds / (1000 * 60)) % 60),
        hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24);
        var formatterText = "";
         if(hours < 1){
             if(minutes < 1){
                 formatterText = seconds+" seconds ago";
             }else{
                 formatterText = minutes+" minutes ago";
             }           
         }else if(hours < 24){
                 formatterText = hours+" hours ago";
         }else if(hours > 24 && hours < 168){
                 formatterText = Math.ceil(hours/24)+" days ago";
         }else if(hours > 168 && hours < 720){
                 formatterText = Math.ceil(hours/168)+" weeks ago";
         }else if(hours > 720 && hours < 8760){
                 formatterText = Math.ceil(hours/720)+" months ago";
         }else{
                 var yearDifference = new Date().getFullYear() - new Date(currentDate.toString()).getFullYear();
             	 if(yearDifference == 0){
                 	yearDifference= yearDifference + 1;
             	}
                formatterText = yearDifference+" years ago";
         }  
         return formatterText;
    },
    closePopover: function(component, event, helper) {
      var toggleDialog = component.find('snapInDialog');
      var isCurrentOpen = component.get('v.isCurrentOpen');  
      var isPopupCliked = this.isClickedOnPopup(event, 'slds-popover__body poopover-padding');
      //Closing all the snap poopover except current selected  
        if(!isPopupCliked){
            for(var eachObject in toggleDialog) {
                if(event.target !=null){
                    if(event.target.dataset.value == undefined){
                        $A.util.addClass(toggleDialog[eachObject], 'slds-hide');
                        isCurrentOpen[eachObject] = false;
                    }
                }
            }
        component.set('v.isCurrentOpen', isCurrentOpen);
        }
    },
    isClickedOnPopup: function(event, selectorClass) {
        var currentElement = event.target;
        if(currentElement !=null){
            while (currentElement.className != selectorClass) {
                currentElement = currentElement.parentNode;
                if (!currentElement) {
                    return false;
                }
            }
        }
        return true;
	},
    changeVerificationStatus : function (component, status) {
        var action = component.get("c.changeVerificationStatus"); 
        var nucleusId = component.get("v.nucleusId");
        var summaryModal = component.get("v.accountSnapDetails");
        var accountId = component.get("v.accountId");
        var caseId = component.get("v.caseId");
        component.set("v.isLoadingCodes", true);
        action.setParams({
            strStatus : status,
            strCustomerId : nucleusId,
            strAccountId : accountId,
            strCaseId : caseId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var toggleTFAResponse = response.getReturnValue();
                summaryModal.tfaResponse.backupCodes = toggleTFAResponse.backupCodes;
                component.set("v.accountSnapDetails",summaryModal); 
                this.checkBackupCodes(component, summaryModal); 
                component.set("v.isLoadingCodes", false);
            }
        });
        $A.enqueueAction(action);
    },
	
	//TSM-1931
    // Checking Email Verified or Not
    emailVerificationCheck: function (component, event, helper) {
        var caseId = component.get("{!v.caseId}");
        var action = component.get("c.checkEmailVerified"); 
        const accountSnapDetails = component.get('v.accountSnapDetails');
        action.setParams({
            caseID: caseId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set("v.isEmailVerfied",  response.getReturnValue());
                var caseData=response.getReturnValue();                
                if(caseData.Is_Verified__c===true){                    
                    accountSnapDetails.tfaDateFormatting = new Date(caseData.Verified_Date__c);
                    accountSnapDetails.aovVerifiedType = "with Email";
                    accountSnapDetails.device = caseData.Verified_Email__c;
                    accountSnapDetails.deviceType = "6 digit pin";
                    accountSnapDetails.deviceIpGeo = "advisor input";
                    accountSnapDetails.isAovVerified = caseData.Is_Verified__c;
                }
                //TSM-4402 - Skipping the second initilization - Need to move to wrapper
                if(accountSnapDetails.isUnAuthenticated == undefined){
                    accountSnapDetails.isUnAuthenticated = caseData.Unauthenticated__c;
                }
                component.set('v.accountSnapDetails', accountSnapDetails);
            }else{
                accountSnapDetails.isAovVerified = false;
                component.set('v.accountSnapDetails', accountSnapDetails);
            }
        });
        $A.enqueueAction(action);
    },
	
	toggleDialogue : function(component, event) {
     //Getting the toopTip menu value   
      var targetIcon = event.currentTarget;
      var targetValue = targetIcon.dataset.value;
      var toggleDialog = component.find('snapInDialog');
      var isCurrentOpen = component.get('v.isCurrentOpen');
         //when clicked again, it will disappear
        component.set("v.displayEdit",true); 
        component.set("v.disableSave",true);
        for(var eachObject in toggleDialog) {
            $A.util.addClass(toggleDialog[eachObject], 'slds-hide');
            if (eachObject != targetValue) isCurrentOpen[eachObject] = false;
        }
        if(isCurrentOpen[targetValue] == false){
            $A.util.removeClass(toggleDialog[targetValue], 'slds-hide'); 
            isCurrentOpen[targetValue] = true;
        }else if(isCurrentOpen[targetValue] == true){
            $A.util.addClass(toggleDialog[targetValue], 'slds-hide');
            isCurrentOpen[targetValue] = false;
        }       
        component.set('v.isCurrentOpen', isCurrentOpen); 
    },
	 updateStatus: function(component,event,helper){
        var nucleusId = component.get("v.nucleusId");
        var caseObj = component.get("v.caseObj");  
        var status = component.get("v.primaryState");
        var reason = component.get("v.currentReason");
		var accountSummary = component.get("v.accountSummary");
        var email = accountSummary.email; //caseObj.Account.PersonEmail;;
        console.log('caseObj--',JSON.stringify(caseObj));
        var requestObject = {};
        requestObject['customerId'] = nucleusId;
        if(caseObj.Id != undefined) {
        	requestObject['caseId'] = caseObj.Id;     
        }
        requestObject['accountId'] = component.get("v.accountId");//caseObj.AccountId;
        requestObject['status']=status;
		requestObject['oldStatus']=component.get("v.oldStatus");
        requestObject['reasonCode']=reason;
        requestObject['email']=email;
		
        console.log('requestObj--',requestObject);
        var action = component.get("c.updateAccountStatus");
        action.setParams({
            reqParameters: requestObject
        });
        action.setCallback(this,function(response){
            console.log('response after update::',response.getReturnValue());
            if(response.getState()==='SUCCESS')
            {
                if(status=='DELETED'){
                    //fire component event to tsmwrapper
                    var refreshAccEvnt= component.getEvent("RefreshPersona");
                    refreshAccEvnt.fire();
                    
                }
                this.fetchSummaryAfterUpdate(component,event,helper);
            }
            else if(response.getState()==='ERROR')
            {
                component.set("v.updateStatusModal",false);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type":'error',
                        "message": "Something went wrong.Please contact your IT."
                    });
                    toastEvent.fire(); 
            }
        });
        $A.enqueueAction(action);
    },
    //fetching updated account details after update 
    fetchSummaryAfterUpdate: function(component,event,helper){
        var nucleusId = component.get("v.nucleusId");
        var fetchAction = component.get("c.getAccountDetailsByNucleusId"); 
        var toastEvent = $A.get("e.force:showToast");
        fetchAction.setParams({
            nucleusId:nucleusId
        });
        fetchAction.setCallback(this,function(newResponse){
            if(newResponse.getState()==='SUCCESS'){
                component.set("v.openSpinner",false);
                toastEvent.setParams({
                    "type":'success',
                    "message": "Account Status successfully updated."
                });
                toastEvent.fire();
                component.set("v.updateStatusModal",false);
                var accountSummary = newResponse.getReturnValue();
                component.set("v.accountSnapDetails",accountSummary);
				component.set("v.oldstatus",accountSummary.status);
            }
        });
        $A.enqueueAction(fetchAction);
    },
})