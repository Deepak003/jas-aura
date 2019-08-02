({
    afterRender: function (cmp,helper) {
        this.superAfterRender();
        helper.windowClick = $A.getCallback(function(event){
            if(cmp.isValid()){
                helper.closePopover(cmp,event,helper);
            }
        });
        document.addEventListener('click',helper.windowClick);      

    },
    unrender: function (cmp,helper) {
        this.superUnrender();
        document.removeEventListener('click',helper.windowClick);        
    }
})