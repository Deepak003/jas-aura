var vm = require('vm');var fs = require('fs');
var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction','localizationService']);

//var AddSubscriptionController = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AddSubscription/AddSubscriptionController.js')), {$A: $A});
var AddSubscriptionController = require('../../../aura/tsm/AddSubscription/AddSubscriptionController.js');


var AddSubscriptionController = require('../../../aura/tsm/AddSubscription/AddSubscriptionController.js');

describe('AddSubscriptionController', function() {
    var component, event, helper;
	
	beforeEach(function() {
        component = jasmine.createSpyObj('component', ['set', 'find', 'get']);
        event = jasmine.createSpyObj('event', ['getSource', 'getParam']);
        helper = jasmine.createSpyObj('helper', ['doInitHelper','fetchOriginSubscriptionTypesHelper','fetchCost','helperonConfirm','onChangeActionHelper']);
		action = jasmine.createSpyObj('action', ['setParams']);
		action.setParams = jasmine.createSpy('action.setParams').and.returnValue('');
		component.get = jasmine.createSpy('component.get').and.returnValue('');
		component.find = jasmine.createSpy('component.find').and.returnValue({set: function() {return '';},get: function() {return '';}});
		$A.get=jasmine.createSpy('$A.get').and.returnValue({fire: function() {return '';},
																setParams:function(){return '';}});
        });

	describe('doInit', function() {
		beforeEach(function() {
			$A.localizationService = jasmine.createSpyObj('$A.localizationService', ['formatDateUTC']);																
            AddSubscriptionController.doInit(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
        });
    });

	describe('navigateBack', function() {
		beforeEach(function() {
            AddSubscriptionController.navigateBack(component, event, helper);
        });
        it('Setter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
			expect(component.find).toHaveBeenCalled();
        });
    });
	
	describe('navigateForward', function() {
		beforeEach(function() {
            AddSubscriptionController.navigateForward(component, event, helper);
        });
        it('Setter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalledWith('v.isFirstPage',false);
			expect(component.set).toHaveBeenCalledWith('v.billingActionVal','');
			expect(component.get).toHaveBeenCalledWith('v.membership');
        });
		it('Helper Methods Invocation', function() {
			expect(helper.fetchCost).toHaveBeenCalled();
        });
    });
	
	describe('onConfirm', function() {
		beforeEach(function() {
            AddSubscriptionController.onConfirm(component, event, helper);
        });
        it('Helper Methods Invocation', function() {
			expect(helper.helperonConfirm).toHaveBeenCalled();
        });
    });
	
	describe('closeModal', function() {
		beforeEach(function() {
            AddSubscriptionController.closeModal(component, event, helper);
        });
        it('Events Invocation', function() {
			expect($A.get).toHaveBeenCalled();
        });
    });
	
	describe('onChangeAction', function() {
		beforeEach(function() {
            AddSubscriptionController.onChangeAction(component, event, helper);
        });
        it('Helper Methods Invocation', function() {
			expect(helper.onChangeActionHelper).toHaveBeenCalled();
        });
    });
});
