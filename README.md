Challenge3
Authors: Gregory Jones (16036844) + Sean Kearney (16007716)
Gitlab link: https://gitlab.uwe.ac.uk/g45-jones/IOT_Challenge3.git
Description:
This is the readme for Challenge 3 assignment. The solution uses a node.js sever with the noble plugin to get data from the microbit BLE services.
The services implemented are: Accelerometer and UART. The readme will be broken down into sections for each. The solution uses the index.html served by the node Sever
as the starting point for all functions.

Due to large amounts of setup required and specific hardware requirements (noble does not work with all ble adapters) we will demo our assignment to our tutor.
There are errors and inconsistent behaviours that might be related to hardware or the noble plugin that is out of our control, basic instructions to run the solution are
included assuming perfect running conditions.

Repo:
  sever branch = master
  microbit branch = microbit

Basic usage:
To Run Sever:
0. Clone repo.
1. Install node.
2. Install latest version of Noble.
3. run node index.js.
4. Select function to execute.
5. Ensure microbit is setup and flashed with corresponding program to function.
6. ctrl + c to end node server
7. repeat steps 3 - 6 with different functions.

Microbit setup.
0. Clone repo.
1. enter uart and/or accl directory.
2. execute yt target bbc-microbit-classic-get
3. execute yt build
4. flash microbit with (uart or accl) -combined.hex file
5. steps 2-4 will need to be repeated for each program once.

Acclometer:
Require no further input once the microbit is flashed with the correct hex file.

Uart:
The program defaulted to a listening state, as shown by the L on the display. It must be in this state
to receive messages from the central device.

To send messages to the central device, the central first needs to be in the getMessages function.

On the microbit press buttonA, this will change to the sending state. On the display is the currently selected ascii character.
To change character press buttonA to go down through the available character set and buttonB to go up. This selection wraps around the ends of the
available character set. To add a character to your message first press and hold buttonB then buttonA, a plus will show on screen, release both buttons to
return to selection. When you have completed your message press and hold buttonA then buttonB, a bar will show on screen, release both buttons to return to the
listening state. The central device needs to be the getMessage state for the message be receaved on the central device properly.
