var vm = require('vm');var fs = require('fs');
var path = require('path');

const $A = jasmine.createSpyObj('$A', ['get','enqueueAction','localizationService']);

//var AddSubscriptionHelper = vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../../aura/tsm/AddSubscription/AddSubscriptionHelper.js')), {$A: $A});
var AddSubscriptionHelper = require('../../../aura/tsm/AddSubscription/AddSubscriptionHelper.js');


var AddSubscriptionHelper = require('../../../aura/tsm/AddSubscription/AddSubscriptionHelper.js');

describe('AddSubscriptionHelper', function() {
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

	describe('doInitHelper', function() {
		beforeEach(function() {
            AddSubscriptionHelper.doInitHelper(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
			expect(component.get).toHaveBeenCalled();
        });
    });
	
	describe('fetchOriginSubscriptionTypesHelper', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.fetchOriginSubscriptionTypes').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
            AddSubscriptionHelper.fetchOriginSubscriptionTypesHelper(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
			expect(component.get).toHaveBeenCalled();
        });
		it('Enque Invocation', function() {
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
	
	describe('fetchCost', function() {
		beforeEach(function() {
			component.get = jasmine.createSpy('get').withArgs('c.fetchCostOfNewSubscription').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
            AddSubscriptionHelper.fetchCost(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.set).toHaveBeenCalled();
			expect(component.get).toHaveBeenCalled();
        });
		it('Enque Invocation', function() {
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
	
	describe('helperonConfirm', function() {
		beforeEach(function() {
		component.get = jasmine.createSpy('get').withArgs('c.purchaseNewOriginSubsription').and.returnValue({
            setParams: function() {},
			setCallback: function(s,f) {
                var response={getState:function(){return 'SUCCESS'},
				getReturnValue:function(){return ''}}
				f(response);
            }
			})
			.withArgs('v.memberActionVal').and.returnValue("")
			.withArgs('v.memberActionLabel' ).and.returnValue("")
			.withArgs('v.nucleusId').and.returnValue("")
			.withArgs('v.billingActionVal').and.returnValue("")
			.withArgs('v.paymentAgreementId').and.returnValue("")
			.withArgs('v.cardType').and.returnValue("")
			.withArgs('v.membershipCost').and.returnValue("");
            AddSubscriptionHelper.helperonConfirm(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.get).toHaveBeenCalled();
        });
		it('Enque Invocation', function() {
			expect($A.enqueueAction).toHaveBeenCalled();
        });
    });
	
	describe('onChangeActionHelper', function() {
		beforeEach(function() {
            AddSubscriptionHelper.onChangeActionHelper(component, event, helper);
        });
        it('Getter Methods Invocation', function() {
			expect(component.find).toHaveBeenCalled();
			expect(component.set).toHaveBeenCalledWith('v.enableNextButton',false);
        });
    });
});
