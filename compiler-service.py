import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.websocket as ws
from tornado.options import define, options

from subprocess_communication import SubprocessCommunication
import subprocess
import time
import threading



def setupCompilerService(com):
    args=['py','C:\\dev\\web\\CodeOnline\\userpgm.py']
    p=subprocess.Popen(args,stdin=com.getInputStream(),stdout=com.getOutputStream(),stderr=com.getOutputStream())
    p.wait()
    print("program ended")
    time.sleep(0.5)
    com.endCommunication()


define('port', default=8888, help='port to listen on')

class CompilerService(ws.WebSocketHandler):

    @classmethod
    def route_urls(cls):
        return [(r'/',cls, {}),]
    
    
    def open(self):
        self.__issetup=False
        self.__supp_langs=('py--','java')
        self.__com=SubprocessCommunication()

        pass
        
    def on_message(self, message):
        if self.__issetup==False:
            lang=message[0:4]
            if lang in self.__supp_langs:
                #pgmfile=open('C:\\dev\\web\\CodeOnline\\userpgm.py','w+')
                #pgmfile.write(message[4:])
                #pgmfile.close()

                def callback(msg):
                    self.write_message(msg)

                self.__com.addOuputStreamListner(callback)
                threading.Thread(target=setupCompilerService,args=[self.__com]).start()
            self.__issetup=True
        else:
            self.__com.writeStream(message+'\r\n')
                
        
    
    def on_close(self):
        print("connection is closed")
    
    def check_origin(self, origin):
        return True

def initiate_server():
    #create a tornado application and provide the urls
    app = tornado.web.Application(CompilerService.route_urls())
    
    #setup the server
    server = tornado.httpserver.HTTPServer(app)
    server.listen(options.port)
    
    #start io/event loop
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    initiate_server()