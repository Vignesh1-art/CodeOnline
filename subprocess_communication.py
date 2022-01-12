import os
import threading
import time
import asyncio
class SubprocessCommunication:
    def __init__(self):
        self.__r1,self.__w1=os.pipe()
        self.__r2,self.__w2=os.pipe()
        self.__isrunning=True
        self.__callback=None
        self.__buffer=""
        self.__readThread=threading.Thread(target=self.__readStream)
        self.__readThread.start()
        self.__sendThread=threading.Thread(target=self.__sendOutputStream)
        self.__sendThread.start()
        #(r1,w1) is user to pgm and (r2,w2) is pgm to user
    
    def getOutputStream(self):
        return self.__w2
    
    def getInputStream(self):
        return self.__r1
    
    def addOuputStreamListner(self,callback):
        self.__callback=callback

    def __readStream(self):
        while self.__isrunning:
            b=os.read(self.__r2, 1)
            if self.__isrunning:
                c=b.decode('ascii')
                self.__buffer+=c
        
    def writeStream(self,string):
        os.write(self.__w1, string.encode('ascii'))
    
    def flush(self):
        os.write(self.__w2,"\n".encode('ascii'))

    def __endOutputStream(self):
        self.__isrunning=False
        os.write(self.__w2,"\n".encode('ascii'))

    def endCommunication(self):
        self.__endOutputStream()
    
    def __sendOutputStream(self):
        asyncio.set_event_loop(asyncio.new_event_loop())
        while self.__isrunning:
            if self.__callback!=None and self.__buffer!="":
                self.__callback(self.__buffer)
                self.__buffer=""
            time.sleep(0.02)
            