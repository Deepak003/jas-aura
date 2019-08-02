var vm = require('vm');var fs = require('fs');
var path = require('path');
//var AccountBasicInfoHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AccountBasicInfo/AccountBasicInfoHelper.js')), {$A: $A});
//var AccountBasicInfoHelper = require('../../../aura/tsm/AccountBasicInfo/AccountBasicInfoHelper.js');

var AccountBasicInfoHelper = require('../../../aura/tsm/AccountBasicInfo/AccountBasicInfoHelper.js');

describe('AccountBasicInfoHelper', function() {
    var component, event, helper, module, callback, globalOptin,thirdPartyOptin;
    beforeEach(function() {
        global.$A = { util: jasmine.createSpyObj('$A.util', ['toggleClass']), enqueueAction: function() {}};
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement','getEvent']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['updateCustomerFlag','saveAccountData','showSpinner','hideSpinner', 'showSocialSpinner', 'hideSocialSpinner']);
        component.find = jasmine.createSpy('find').and.returnValue({one: {}, two: {}});
        component.getEvent = jasmine.createSpy('getEvent').and.returnValue({fire: function(){}});
        component.get = jasmine.createSpy('get').and.returnValue({
            setParams: function() {},
            setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},getReturnValue:function(){return '{"response":[{"Language":"test", "Countries":"test","language":"test_test"}]}'}}
                f(response);
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

    describe('accordianToggle', function() {
        beforeEach(function() {
			AccountBasicInfoHelper.accordianToggle(component, event);
        });
        it('will open and close the accordian on click', function() {      
            expect($A.util.toggleClass).toHaveBeenCalledWith({}, 'slds-show');
            expect($A.util.toggleClass).toHaveBeenCalledWith({}, 'slds-hide');       
        });
    });

    describe('searchCustomerData', function() {
        beforeEach(function() {
            //spyOn(component,"getEvent").and.returnValue({fire:{}});
            AccountBasicInfoHelper.searchCustomerData(component, event, helper);
        });
        it('should call the backend method searchCustomerData and set necessary variables', function() {
            expect(component.get.calls.count()).toEqual(5);           
            expect(component.set.calls.count()).toEqual(10);
        });
    });

    /*describe('saveCustomer', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.saveCustomer(component, event, helper);
        });
        it('should call the backend method saveCustomer and set necessary variables', function(done) {
            expect(helper.updateCustomerFlag).toHaveBeenCalled();
            expect(helper.saveAccountData).toHaveBeenCalled();

        });
    });*/

    describe('saveAccountData', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.saveAccountData(component, event,helper, callback);
            //spyOn("component","getEvent").and.returnValue({'test':'test'});
        });
        it('should call the backend method saveAccountData and set necessary variables', function() {
            expect(helper.showSpinner).toHaveBeenCalled();
            expect(helper.hideSpinner).toHaveBeenCalled();
            expect(component.get.calls.count()).toEqual(11);           
            expect(component.set.calls.count()).toEqual(1);
        });
    });

    describe('updateCustomerFlag', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.updateCustomerFlag(component, event,helper, callback);
        });
        it('should call the backend method updateCustomerFlagData and set necessary variables', function() {
            expect(helper.showSpinner).toHaveBeenCalled();
            expect(component.get.calls.count()).toEqual(4);           
        });
    });

    describe('showSpinner', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.showSpinner(component, event);
        });
        it('should show the spinner', function() {
            expect(component.set.calls.count()).toEqual(1);          
        });
    });

    describe('hideSpinner', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.hideSpinner(component, event);
        });
        it('should hode the spinner', function() {
            expect(component.set.calls.count()).toEqual(1);          
        });
    });

    describe('showSocialSpinner', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.showSocialSpinner(component, event);
        });
        it('should show social spinner', function() {
            expect(component.set.calls.count()).toEqual(1);          
        });
    });

    describe('hideSocialSpinner', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.hideSocialSpinner(component, event);
        });
        it('should hide social spinner', function() {
            expect(component.set.calls.count()).toEqual(1);          
        });
    });

    describe('populateWWCEObjects', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.populateWWCEObjects(component, event, helper);
        });
        it('should populate WWCE Objects', function() {
            expect(component.set.calls.count()).toEqual(3);          
        });
    });

    describe('optInSave', function() {
        beforeEach(function() {
            AccountBasicInfoHelper.optInSave(component, event, helper, globalOptin, thirdPartyOptin);
        });
        it('perform opt in save function', function() {
            expect(component.get.calls.count()).toEqual(2); 
            expect(helper.showSocialSpinner).toHaveBeenCalled();       
        });
    });

    afterAll( () => {
        ['$A'].forEach(prop => delete global[prop]);
    })

});
