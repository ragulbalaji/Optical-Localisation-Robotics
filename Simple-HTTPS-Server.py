# https://blog.anvileight.com/posts/simple-python-http-server/
# openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

import BaseHTTPServer, SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, certfile='cert.pem', server_side=True, keyfile='key.pem')

httpd.serve_forever()
