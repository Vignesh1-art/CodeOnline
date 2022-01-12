


class Terminal{

    constructor(termid,fontsize){
        super();
        var c = document.getElementById(termid);
        this.ctx=c.getContext('2d');

        let r=c.getBoundingClientRect();
        c.width=r.width;
        c.height=r.height;

        this.ctx.fillStyle="black";
        this.ctx.textBaseline = "top";
        this.ctx.fillRect(0, 0, c.width, c.height);
        this.posx=0;
        this.posy=0;
        this.padx=0;
        this.pady=3;
        this.width=c.width;
        this.height=c.height;
        this.iscursor=true;
        setInterval(()=>{this.cursorHandler()},700);
        this.curbufline=this.posy;
        this.buffer="";
        this.fontsize=fontsize;
    }


    setWriteMode(color='white'){
        this.ctx.font = this.fontsize.toString()+"px Aerial";
        this.ctx.fillStyle =color;
    }

    writeText(text){
    //renders text on screen
    this.removeCursor();
    this.setWriteMode();
    this.ctx.fillStyle='white';

    for(let i=0;i<text.length;i++){
        this.drawChar(text[i]);
    }

    }

    drawChar(char){
        let charwidth=Math.ceil(this.ctx.measureText(char).width);
        let isOverflow=(this.posx+charwidth)>(this.width);

        if(isOverflow){
            this.posy+=this.fontsize+this.pady;
            this.posx=0;
        }

        if(char=='\n'){
            this.posy+=this.fontsize+this.pady;
            this.posx=0; 
        }
        else{
        this.ctx.fillText(char,this.posx,this.posy);
        this.posx=this.posx+charwidth+2;
        }
    }

    clearText(){
        //clears text from screen
        let h=this.posy-this.curbufline+this.fontsize;
        this.setWriteMode('black');
        this.ctx.fillRect(0,this.curbufline,this.width,h);
        this.posx=0;
        this.posy=this.curbufline;
    }

    writeOnBuffer(string){
        this.buffer+=string;
        
        this.writeText(string);
    }

    cursorHandler(){
        if(this.iscursor){
            this.setWriteMode('white');
            this.ctx.fillRect(this.posx,this.posy,7,this.fontsize);
            this.iscursor=false;
        }else{
            this.setWriteMode('black');
            this.ctx.fillRect(this.posx,this.posy,7,this.fontsize);
            this.iscursor=true;
        }
    }

    removeCursor(){
        this.setWriteMode('black');
        this.ctx.fillRect(this.posx,this.posy,7,this.fontsize);
        this.iscursor=false;
    }

    removeFromBuffer(){
        this.buffer=this.buffer.substring(0,this.buffer.length-1);
        this.clearText();
        this.writeText(this.buffer);
    }

    nextLine(callback){
        //callback function is handler for after clicking next line
        this.removeCursor();
        this.posx=0;
        this.posy+=this.fontsize+this.pady;
        this.curbufline=this.posy;
        this.buffer="";
        if(callback!=null)
            callback(this.buffer);
    }

    getBufferValue(){
        return this.buffer;
    }
    clearBuffer(){
        this.curbufline=this.posy;
        this.buffer="";
    }
}