class Keyboard{
    constructor(id){
        this.listner=document.getElementById(id);
        this.listner.addEventListener('keydown',(event)=>{this.onKeyDown(event)});
    }
    onKeyDown(event){
        //this function filters unwanted callbacks like shift,caps etc and call user's callback
        let keyName=event.key;
        if(keyName==undefined)
        return;
        if(keyName.length>1 && keyName!='Enter' && keyName!='Backspace'){
            //ignore special keys like shift,caps and not Enter
            return;
        }
        this.callback(keyName);
    }
    registerKeyDownCallback(callback){
        this.callback=callback;
    }
}