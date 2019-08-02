var vm = require('vm');var fs = require('fs');
var path = require('path');
var $A = { util: jasmine.createSpyObj('$A.util', ['toggleClass', 'removeClass', 'addClass'])};

//var AccountSummaryController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AccountSummary/AccountSummaryController.js')), {$A: $A});
var AccountSummaryController = require('../../../aura/tsm/AccountSummary/AccountSummaryController.js');


var AccountSummaryController = require('../../../aura/tsm/AccountSummary/AccountSummaryController.js');

describe('AccountSummaryController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);

        helper = jasmine.createSpyObj('helper', ['fetchAccountSummary','unShieldAccount','sendTfaSetupEmail', 'generateBackupCodes', 'checkBackupCodes']);

        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue({
            tfaResponse: function(){}
        });
    });

    describe('getAccountSummary', function() {
        beforeEach(function() {
            AccountSummaryController.getAccountSummary(component, event, helper);
        });
        it('will call the helper method searchCustomerData', function() {    
            expect(helper.fetchAccountSummary).toHaveBeenCalled();
            expect(component.set.calls.count()).toEqual(1);            
        });
    });

    describe('handleRadioClick', function() {
        beforeEach(function() {
            AccountSummaryController.handleRadioClick(component, event, helper);
        });
        it('will handleRadioClick for setting the email', function() {      
           expect(component.set.calls.count()).toEqual(1);           
        });
    });

   /* describe('toggleDialogue', function() {
        beforeEach(function() {
            AccountSummaryController.toggleDialogue(component, event, helper);
        });
        it('will toggle the social events', function() {     
             
        });
    });*/

    describe('unShieldAccount', function() {
        beforeEach(function() {
            AccountSummaryController.unShieldAccount(component, event, helper);
        });
        it('will unshield the account', function() {
           expect(helper.unShieldAccount).toHaveBeenCalled()                        
        });
    });

    describe('shieldAccount', function() {
        beforeEach(function() {
            AccountSummaryController.shieldAccount(component, event, helper);
        });
        it('will shield the account', function() {
           expect(helper.unShieldAccount).toHaveBeenCalled()                        
        });
    });

    describe('onChangeAOVEmailObj', function() {
        beforeEach(function() {
            AccountSummaryController.onChangeAOVEmailObj(component, event, helper);
        });
        it('will update the country model based on the combobox selection', function() {
                expect(component.set.calls.count()).toEqual(1);
        });
    });

    describe('toggleBackupcodes', function() {
        beforeEach(function() {
            AccountSummaryController.toggleBackupcodes(component, event, helper);
        });
        it('will update the language model based on the combobox selection', function() {
                expect(component.get.calls.count()).toEqual(1);
                expect(component.find.calls.count()).toEqual(1);
        });
    });

    describe('sendTFAEmail', function() {
        beforeEach(function() {
            AccountSummaryController.sendTFAEmail(component, event, helper);
        });
        it('will call the sendTFAEmail function', function() {
            expect(helper.sendTfaSetupEmail).toHaveBeenCalled() 
        });
    });

    describe('generate backup codes', function() {
        beforeEach(function() {
            AccountSummaryController.generateCodes(component, event, helper);
        });
        it('will call the generateBackupCodes function', function() {
            expect(helper.generateBackupCodes).toHaveBeenCalled() 
        });
    });
});
