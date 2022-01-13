
class Terminal{
    #ctx
    #c
    #posx
    #posy
    #padx
    #pady
    #buffer
    #tempBuffer
    #fontsize
    #cursor
    constructor(termid,fontsize){
        this.#c = document.getElementById(termid);
        this.#ctx=this.#c.getContext('2d');
        //Screen Setup
        let r=this.#c.getBoundingClientRect();
        this.#c.width=r.width;
        this.#c.height=r.height;
        this.#fontsize=fontsize;
        this.#ctx.textBaseline = "top";
        this.clearScreen();
        this.#posx=0;
        this.#posy=0;
        this.#padx=0;
        this.#pady=3;
        this.#buffer="";
        this.#tempBuffer="";
        this.#cursor=true;
        setInterval(()=>{this.#handleCursor()},700);
    }

    clearScreen(){
        this.#posx=0;
        this.#posy=0;
        this.#ctx.fillStyle="black";
        this.#ctx.fillRect(0, 0, this.#c.width, this.#c.height);
    }

    #setWriteMode(){
        this.#ctx.font = this.#fontsize.toString()+"px Aerial";
        this.#ctx.fillStyle ='white';
    }

    #drawChar(char){
        //This function is responsible for writing characters in appropriate position
        this.#drawCursor('black');
        this.#setWriteMode();
        let charwidth=Math.ceil(this.#ctx.measureText(char).width);
        let isOverflow=(this.#posx+charwidth)>(this.#c.width-1);

        if(isOverflow){
            this.#posy+=this.#fontsize+this.#pady;
            this.#posx=0;
        }

        if(char=='\n'){
            this.nextLine();
        }
        else{
            this.#ctx.fillText(char,this.#posx,this.#posy);
            this.#posx=this.#posx+charwidth+2;
        }
    }

    writeTextOnBuffer(str){
        this.#tempBuffer+=str;

        for(let i=0;i<str.length;i++){
            this.#drawChar(str[i]);
        }
    }

    setBuffer(){
        this.#buffer+=this.#tempBuffer;
    }

    writeText(str){
        this.#buffer+=this.#tempBuffer;
        this.#tempBuffer="";
        this.#buffer+=str;
        
        for(let i=0;i<str.length;i++){
            this.#drawChar(str[i]);
        }
    }

    removeFromBuffer(){
        if(this.#tempBuffer.length==0)
            return;
        this.#tempBuffer=this.#tempBuffer.substring(0,this.#tempBuffer.length-1);
        this.clearScreen();

        for(let i=0;i<this.#buffer.length;i++){
            this.#drawChar(this.#buffer[i]);
        }

        for(let i=0;i<this.#tempBuffer.length;i++){
            this.#drawChar(this.#tempBuffer[i]);
        }

    }
    #drawCursor(color){
        this.#ctx.fillStyle =color;
        this.#ctx.fillRect(this.#posx, this.#posy,10, this.#fontsize);
    }
    #handleCursor(){
        if(this.#cursor){
            this.#drawCursor('white');
            this.#cursor=false;
        }else{
            this.#drawCursor('black');
            this.#cursor=true;
        }
    }

    getBuffer(){
        return this.#tempBuffer;
    }

    setBuffer(){
        this.#buffer+=this.#tempBuffer;
        this.#tempBuffer="";
    }

    nextLine(){
        this.#drawCursor('black');
        this.#posy+=this.#fontsize+this.#pady;
        this.#posx=0; 
    }

}