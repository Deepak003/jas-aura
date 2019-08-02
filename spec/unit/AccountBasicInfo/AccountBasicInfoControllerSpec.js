var vm = require('vm');var fs = require('fs');
var path = require('path');
global.$A = { util: jasmine.createSpyObj('$A.util', ['toggleClass'])};
//var JSON = {parse: null};
//JSON.parse = jasmine.createSpy('parse').and.returnValue({response: [{}]});
//var AccountBasicInfoController = require('../../../aura/tsm/AccountBasicInfo/AccountBasicInfoController.js');

//var AccountBasicInfoController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AccountBasicInfo/AccountBasicInfoController.js')), {$A: $A});

var AccountBasicInfoController = require('../../../aura/tsm/AccountBasicInfo/AccountBasicInfoController.js');

describe('AccountBasicInfoController', function() {
    var component, event, helper, module;
    beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get', 'getElement']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['getAgeRequirements','enableOrDisableSaveButton','setNamespaces','searchCustomerData','accordianToggle','populateWWCEObjects','helperFun','saveCustomer','optInSave']);
        component.find = jasmine.createSpy('find').and.returnValue({get: function() {return true;}, set: function(){return '';}});
        event.getSource = jasmine.createSpy('getSource').and.returnValue({get: function() {return '';}, set: function(){return '';}});
        component.get = jasmine.createSpy('get').and.returnValue('{"response":[""]}');
    });

    describe('doInit', function() {
        beforeEach(function() {
			AccountBasicInfoController.doInit(component, event, helper);
        });
        it('will call the helper method searchCustomerData', function() {    
            expect(helper.populateWWCEObjects).toHaveBeenCalled();    
            expect(helper.searchCustomerData).toHaveBeenCalled();          
        });
    });

    describe('toggleAccordian', function() {
        beforeEach(function() {
            AccountBasicInfoController.toggleAccordian(component, event, helper);
        });
        it('will call the helper method accordianToggle', function() {      
           expect(helper.accordianToggle).toHaveBeenCalled();           
        });
    });

    describe('toggleSocialEvent', function() {
        beforeEach(function() {
            AccountBasicInfoController.toggleSocialEvent(component, event, helper);
        });
        it('will toggle the social events', function() {     
           expect(component.find.calls.count()).toEqual(1);                   
        });
    });

    describe('toggleAction', function() {
        beforeEach(function() {
            AccountBasicInfoController.toggleAction(component, event, helper);
        });
        it('will toggle the social events', function() {
           expect(helper.optInSave).toHaveBeenCalled()                        
        });
    });

    describe('openEditView', function() {
        beforeEach(function() {
			AccountBasicInfoController.openEditView(component, event, helper);
        });
        it('will toggle between open and view of the dialog', function() {
            expect(component.set).toHaveBeenCalledWith('v.isOpen',false); 
            expect(component.set).toHaveBeenCalledWith('v.isEdit',true);
        });
    });

    describe('handleCountryChange', function() {
        beforeEach(function() {
            AccountBasicInfoController.handleCountryChange(component, event, helper);
        });
        it('will update the country model based on the combobox selection', function() {
                expect(component.get.calls.count()).toEqual(1);
        });
    });

    describe('handleLanguageChange', function() {
        beforeEach(function() {
            AccountBasicInfoController.handleLanguageChange(component, event, helper);
        });
        it('will update the language model based on the combobox selection', function() {
                expect(component.get.calls.count()).toEqual(2);
        });
    });

    describe('toggleProcessing', function() {
        beforeEach(function() {
            AccountBasicInfoController.toggleProcessing(component, event, helper);
        });
        it('will toggle the process data function poopover', function() {
            expect(component.find.calls.count()).toEqual(2);
        });
    });

    describe('stopProcessing', function() {
        beforeEach(function() {
            AccountBasicInfoController.stopProcessing(component, event, helper);
        });
        it('will stop toggle the process data function poopover', function() {
            expect(component.find.calls.count()).toEqual(2);
        });
    });

    afterAll( () => {
        ['$A'].forEach(prop => delete global[prop]);
    })
});
