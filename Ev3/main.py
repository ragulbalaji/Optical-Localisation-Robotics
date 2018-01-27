import socket
import sys

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(('', 8080))
    s.listen(1)
    conn, addr = s.accept()
    with conn:
        print(addr, 'connected.')
        while True:
            data = conn.recv(1024)
            if not data:
                continue
            print(data)
