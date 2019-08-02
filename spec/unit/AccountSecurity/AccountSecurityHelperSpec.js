const vm = require('vm');const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const $A = jasmine.createSpyObj('$A', ['enqueueAction']);
$A.util = jasmine.createSpyObj('$A.util', ['addClass']);

/* const target = 'AccountSecurity/AccountSecurityHelper.js';
const AccountSecurityHelper = vm.runInNewContext(
    fs.readFileSync(
        fs.existsSync(path.join(rootPath, '/aura/tsm')) ? 
            path.join(rootPath, '/aura/tsm/', target) :
            path.join(rootPath, '/aura/',target)
    ), {$A: $A}
);
 */
var AccountSecurityHelper = require('../../../aura/tsm/AccountSecurity/AccountSecurityHelper.js');


var AccountSecurityHelper = require('../../../aura/tsm/AccountSecurity/AccountSecurityHelper.js');

describe('AccountSecurityHelper', ()=> {

	let component, event, helper;

	beforeEach(()=> {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['']);
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: ()=> {},
            setCallback: ()=> {}
        });
    });


    describe('fetchEmails', ()=> {        
        it('should call backend', ()=> {
            AccountSecurityHelper.fetchEmails(component);
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });

    // describe('sendEmail', ()=> {        
    //     it('should call backend', ()=> {
    //         component.get = jasmine.createSpy('get').and.callFake((arg)=> {
    //             if(arg == 'c.validateVerificationCode') {
    //                 return { setParams : function() { return ""; }, setCallback : function() { return ""; } };
    //             }
    //             return { find: function() { return ""; }, trim: function() { return "Hi" } }
    //         });

    //         AccountSecurityHelper.sendEmail(component);
    //         expect($A.enqueueAction).toHaveBeenCalled();
    //     });
    // });


    describe('doVerification', ()=> {        
        it('should call backend', ()=> {
            component.get = jasmine.createSpy('get').and.callFake((arg)=> {
                if(arg == 'c.validateVerificationCode') {
                    return { setParams : function() { return ""; }, setCallback : function() { return ""; } };
                }
                return { find: function() { return ""; }, trim: function() { return "Hi" } }
            });

            AccountSecurityHelper.doVerification(component);
            expect($A.enqueueAction).toHaveBeenCalled();
        });
    });

    describe('setAllowedForVerification', ()=> {        
        it('should set value to object', ()=> {
            const emails = [{isAllowedForVerification : false}];
            const out = AccountSecurityHelper.setAllowedForVerification(emails);
            expect(out[0].isAllowedForVerification).toBe(true);
        });
    });

    describe('setTypeText', ()=> {        
        it('should set value to object', ()=> {
            const emails = [{type : "Primary"},{type : "Secondary"}];
            const out = AccountSecurityHelper.setTypeText(emails);
            expect(out[0].typeText).toBe("Primary Email");
            expect(out[1].typeText).toBe("Secondary Email");
        });
    });

    describe('setRecommended', ()=> {        
        it('should set value to object', ()=> {
            const emails = [{isSuspicious : true, isSelected: true, isRecommended: true},{isSuspicious : false}];
            const out = AccountSecurityHelper.setRecommended(emails);
            expect(out[0].isSelected).toBe(false);
            expect(out[0].isRecommended).toBe(false);
            expect(out[1].isSelected).toBe(true);
            expect(out[1].isRecommended).toBe(true);            
        });
    });

    describe('onSelect', function() {        
        it('should set value', function() {
            const emails = [{email : 'siba@prakash' ,isSuspicious : true, isSelected: true, isRecommended: true},{isSuspicious : false}];
            component.get = jasmine.createSpy('get').and.returnValue(emails);

            event.getSource = jasmine.createSpy('getSource').and.returnValue({ get: function() { return emails[0]; } });
            
            AccountSecurityHelper.onSelect(component, event);

            emails[1].isSelected = false;

            expect(component.set).toHaveBeenCalledWith("v.emails", emails);
        });
    });

    describe('onSentEmail', function() {        
        it('should set value', function() {
            const emails = [{email : 'siba@prakash' ,isSuspicious : true, isSelected: true, isRecommended: true},{isSuspicious : false}];
            component.get = jasmine.createSpy('get').and.returnValue(emails);

            event.getSource = jasmine.createSpy('getSource').and.returnValue({ get: function() { return emails[0]; } });
            
            AccountSecurityHelper.onSentEmail(component, event);

            emails[0].isAllowedForVerification = true;

            expect(component.set).toHaveBeenCalledWith("v.emails", emails);
        });
    });
})
