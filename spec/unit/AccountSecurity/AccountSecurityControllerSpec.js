const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass', 'hasClass', 'toggleClass']);


/* const target = 'AccountSecurity/AccountSecurityController.js';

const AccountSecurityController = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
);
 */
var AccountSecurityController = require('../../../aura/tsm/AccountSecurity/AccountSecurityController.js');


var AccountSecurityController = require('../../../aura/tsm/AccountSecurity/AccountSecurityController.js');

describe("AccountSecurityController", function() {
    let component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        component.find = jasmine.createSpy('find').and.returnValue({
            get: ()=> {}
        });
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });

        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);        

        event.currentTarget = jasmine.createSpyObj('event.currentTarget', ['getAttribute']);

        helper = jasmine.createSpyObj('helper', ["fetchEmails", "sendEmail", "doVerification", "setAllowedForVerification", "setTypeText", "setRecommended", "handleVerificationFailure", "onSelect", "onSentEmail"]); 
    });

    describe('doInit', function() {
        beforeEach(function() {
            AccountSecurityController.doInit(component, event, helper);
        });
        it('should call the helper method fetchEmails', function() {       
            expect(helper.fetchEmails).toHaveBeenCalledWith(component);
        });
    });

    describe('sendEmail', function() {
        beforeEach(function() {
            AccountSecurityController.sendEmail(component, event, helper);
        });
        it('should call the helper method sendEmail', function() {       
            expect(helper.sendEmail).toHaveBeenCalledWith(component);
        });
    });

    describe('doVerification', function() {
        beforeEach(function() {
            AccountSecurityController.doVerification(component, event, helper);
        });
        it('should call the helper method doVerification', function() {       
            expect(helper.doVerification).toHaveBeenCalledWith(component);
        });
    });

    describe('handleCancel', function() {
        beforeEach(function() {
            AccountSecurityController.handleCancel(component, event, helper);
        });
        it('should call the helper method set', function() {       
            expect(component.set).toHaveBeenCalledWith("v.isPopover", false);
        });
    });

    describe('onSentEmail', function() {
        beforeEach(function() {
            AccountSecurityController.onSentEmail(component, event, helper);
        });
        it('should call the helper method onSentEmail', function() {       
            expect(helper.onSentEmail).toHaveBeenCalledWith(component);
        });
    });
});
