import socket
import sys
from ev3dev import ev3

motor_right = ev3.LargeMotor('outA')
motor_left = ev3.LargeMotor('outD')
motor_grab = ev3.MediumMotor('outC')

speed = motor_right.max_speed

def spin(deg):
    motor_right.run_to_rel_pos(position_sp=-deg, speed_sp=speed)
    motor_left.run_to_rel_pos(position_sp=deg, speed_sp=speed)

def drive(deg):
    motor_right.run_to_rel_pos(position_sp=deg, speed_sp=speed)
    motor_left.run_to_rel_pos(position_sp=deg, speed_sp=speed)

def power(amt):
    global speed
    speed = amt

def process_data(data):
    data = data.decode('utf-8')
    cmds = data.split(',')
    if cmds[0] == 'd':
        datum = int(cmds[1])
        drive(datum)
    elif cmds[0] == 's':
        datum = int(cmds[1])
        spin(datum)
    elif cmds[0] == 'p':
        datum = int(cmds[1])
        power(datum)
    else:
        print('Unrecognized data', data)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    print('Starting the socket server.')
    s.bind(('', 8080))
    s.listen(1)
    conn, addr = s.accept()
    with conn:
        print(addr, 'connected.')
        while True:
            data = conn.recv(1024)
            if not data:
                continue
            process_data(data)
