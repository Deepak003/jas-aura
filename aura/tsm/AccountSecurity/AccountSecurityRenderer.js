({
    afterRender: function (cmp, helper) {
        this.superAfterRender();
        helper.handleOutSideClick = $A.getCallback(function(e){
            const isOpen = cmp.get('v.isOpen');
            
            if(isOpen){
                const container = cmp.find("account-security");
                const isPopover = cmp.get("v.variant") == "popover";
                const isValid = cmp.isValid() && container && container.getElement() && !container.getElement().contains(e.target);
                
                // if all condition match
                if(isValid && isPopover) {
                    helper.close(cmp);
                }
            }
        });
        document.addEventListener('click',helper.handleOutSideClick);
    },
    unrender: function (cmp,helper) {
        this.superUnrender();
        document.removeEventListener('click',helper.handleOutSideClick);        
    }
})