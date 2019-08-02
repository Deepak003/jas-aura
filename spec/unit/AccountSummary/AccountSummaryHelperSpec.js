var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'addClass']), enqueueAction: function() {}};
//var AccountSummaryHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AccountSummary/AccountSummaryHelper.js')), {$A: $A});
var AccountSummaryHelper = require('../../../aura/tsm/AccountSummary/AccountSummaryHelper.js');


var AccountSummaryHelper = require('../../../aura/tsm/AccountSummary/AccountSummaryHelper.js');

describe('AccountSummaryHelper', function() {
var component, event, helper, module, responseObj = {"accountBasicInfo": '{"status":"SUCCESS","response":[{"name":null,"id":"2254723519","userValue":"none","underageUser":"false"}]}'};
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['updateCustomerFlag']);
        component.find = jasmine.createSpy('find').and.returnValue({one: {}, two: {}});
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                f({
                    getState:()=>{
                        return "SUCCESS"
                    },
                    getReturnValue:()=>{
                        return responseObj;
                    }
                });                
            },
            language: function(){},
            currentCountry: function(){},
            currentLanguage: function(){},
            country: function(){},
            Countries: function(){},
            Languages: function(){},
            id : function(){},
            userValue : function(){},
            email : function(){}
        }); 
        $A.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            fire: function() {}
        });
    });

    describe('fetchAccountSummary', function() {
        beforeEach(function() {
            responseObj = {"accountBasicInfo": '{"status":"SUCCESS","response":[{"name":null,"id":"2254723519","userValue":"none","underageUser":"false","email":"siba@prakash"}]}', "tfaResponse":'{"codeType":"","phoneNumber":"123","regionCode":"ABCD"}'};
            spyOn(AccountSummaryHelper, "checkBackupCodes");
            AccountSummaryHelper.fetchAccountSummary(component, event);            
        });
        it('will call the controller function for getAccountDetailsByNucleusId', function() {      
            expect(component.get.calls.count()).toEqual(2);
            expect(component.set.calls.count()).toEqual(6);
            expect(component.find.calls.count()).toEqual(1);
            expect(component.set).toHaveBeenCalledWith('v.toTFAEmail','siba@prakash');
        });                
    });

    describe('unShieldAccount', function() {
        beforeEach(function() {
            responseObj = JSON.stringify({"response":"Account Locked Successfully."});
            AccountSummaryHelper.unShieldAccount(component, event, "lockAccount");
        });
        it('should call the backend method lockUnlockAccountId', function() {
            expect(component.get.calls.count()).toEqual(3);
        });
    });
    
    describe('sendTfaSetupEmail', function() {
        beforeEach(function() {
            AccountSummaryHelper.sendTfaSetupEmail(component, event);
        });
        it('should call the backend to sendTfaSetupEmail', function() {
            expect(component.get.calls.count()).toEqual(3);           
        });
    });

    describe('checkBackupCodes', function() {
        var accountSummary = {};
        accountSummary.tfaResponse = {"backupCodes": [{"isExpired":"N"}, {"isExpired":"N"}]};
        beforeEach(function() {
            AccountSummaryHelper.checkBackupCodes(component, accountSummary);
        });
        it('will validate available backup codes', function() {                 
            expect(component.set.calls.count()).toEqual(1);  
        });
    });

    describe('generateBackupCodes', function() {
        beforeEach(function() {
            AccountSummaryHelper.generateBackupCodes(component);
        });
        it('will call the generateBackupCodes apex method', function() {       
            expect(component.get.calls.count()).toEqual(3);           
            expect(component.set.calls.count()).toEqual(1);      
        });
    });
});
