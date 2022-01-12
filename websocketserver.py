import socket
import hashlib
import base64
import threading




class WebSocketServer:
    #for purpose of this project this websocket server will only support ascii character data
    def __init__(self,callback,port=5000):
        self.port=port
        s=socket.socket()
        s.bind(('',port))
        s.listen(1)
        self.__isrunning=True
        self.__callback=callback
        c,addr=s.accept()
        self.__c=c
        self.__handleClient()


    def __handleClient(self):
        header=self.__recvHeader()
        resheader=self.__getResponseHeader(header)
        self.__c.send(resheader.encode('ascii'))#connection is setup here
        t1=threading.Thread(target=self.__recvloop)
        t1.start()



    def __recvHeader(self):
        c=self.__c
        header=""
        isprevnextline=False

        while True:
            data=self.__c.recv(1).decode('ascii')
            header+=data
            if data=='\r':
                header+=c.recv(1).decode('ascii')
                if isprevnextline:
                    break
                isprevnextline=True
            else:
                isprevnextline=False
        return header

    def __getResponseHeader(self,header):
        index=header.find("Sec-WebSocket-Key:")
        l=len("Sec-WebSocket-Key:")
        index+=l
        seckey=""
        while header[index]!='\r':
            if header[index]!=' ':
                seckey+=header[index]
            index+=1
        resheader="HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: "
        m=hashlib.sha1()
        k=seckey+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        m.update(k.encode('ascii'))
        sha1=m.digest()
        base64encoded=base64.b64encode(sha1)
        key=base64encoded.decode('ascii')
        resheader+=key
        resheader+='\r\n\r\n'
        return resheader

    def __recvmsg(self):
        c=self.__c
        data=c.recv(1)[0]
        opcode=data & 15
        
        data=c.recv(1)[0]
        mask=(data & 128)>>7
        payloadlen=(data & 127)

        if payloadlen==126:
            data=c.recv(2)
            payloadlen=int.from_bytes(data,'big',signed=False)
        elif payloadlen==127:
            data=c.recv(8)
            payloadlen=int.from_bytes(data,'big',signed=False)
        msg=""
        if mask==1:
            maskingkey=c.recv(4)
            payload=c.recv(payloadlen)
            for i in range(payloadlen):
                data=payload[i]^maskingkey[i%4]
                msg+=chr(data)
        return msg
    
    def __recvloop(self):
        c=self.__c
        while self.__isrunning:
            msg=self.__recvmsg()
            if self.__callback!=None:
                self.__callback(msg)

    def __sendmsg(self,msg):
        c=self.__c
        a=129
        dataframe=bytearray()
        b=a.to_bytes(1,'big')
        dataframe.extend(b)

        msglen=len(msg)
        if msglen<126:
            b=msglen.to_bytes(1,'big')
            dataframe.extend(b)
            msgbyte=bytearray(msg,'ascii')
            dataframe.extend(msgbyte)
        c.send(dataframe)

    def send(self,msg):
        self.__sendmsg(msg)
    
