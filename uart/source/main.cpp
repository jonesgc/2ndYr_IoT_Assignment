#include "MicroBit.h"
#include "MicroBitUARTService.h"
#include "../common/protocol.h"
#include "../common/protocol.cpp"
MicroBit uBit;
MicroBitUARTService *uart;

//PROTOTYPES
void conn(MicroBitEvent e);
void dis(MicroBitEvent e);

//Button listeners.
MicroBitButton buttonA(MICROBIT_PIN_BUTTON_A, MICROBIT_ID_BUTTON_A);
MicroBitButton buttonB(MICROBIT_PIN_BUTTON_B, MICROBIT_ID_BUTTON_B);


int main()
{
  uBit.init();
  protocol protocol;
  uart = new MicroBitUARTService(*uBit.ble, 32, 32);
  //Listen for connection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, conn);
  //Listen for disconnection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, dis);

  //Message string, must be terminated by | to send.
  ManagedString msgString = 0;
  //65 default value for display character, this is the ascii value for A.
  char inChar = 65;
  char eom = '|';
  bool msg = false;
  bool lock = false;
  bool input = false;
  while(1)
  {
    if(!msg)
    {
      while(msg == false)
      {
        while(buttonA.isPressed())
        {
          //End message;
          while(buttonB.isPressed())
          {
            uBit.display.print("|");
            msg = true;
            lock = true;
            uBit.sleep(500);
            if(inChar == 65)
            {
              inChar = 90;
              lock = true;
            }
            else
            {
              inChar--;
              lock = true;
            }
          }
          //Increment once per click, by use of the lock.
          if(lock == false)
          {

            //Wrap the value around character set we want [A-Z].
            if(inChar == 90)
            {
              inChar = 65;
              lock = true;
            }
            else
            {
              inChar++;
              lock = true;
            }
          }
        }
        //Release the lock allowing scrolling again.
        lock = false;
        while(buttonB.isPressed())
        {

          //Increment once per click, by use of the lock.
          if(lock == false)
          {
            //Wrap the value around character set we want [A-Z].
            if(inChar == 65)
            {
              inChar = 90;
              lock = true;
            }
            else
            {
              inChar--;
              lock = true;
            }

          }
          //Add current character on display to msg string.
          while(buttonA.isPressed())
          {
            uBit.display.print("+");
            lock = true;
            input = true;
            uBit.sleep(500);
            if(inChar == 90)
            {
              inChar = 65;
              lock = true;
            }
            else
            {
              inChar++;
              lock = true;
            }
          }
        }
        //Release the lock allowing scrolling again.
        lock = false;

        //Check if the add character command was entered B then A.
        if(input)
        {
          msgString = msgString + inChar;
          input = false;
        }

        //Display ascii character on display, btn a to go forward, btn b to go back.
        //Wrap around the ends, a limted character set is used.
        uBit.display.print(inChar);
      }
    }
    //Msg complete, send message over uart.
    else if(msg)
    {
      int i = 0;
      //Append EOM character to string
      ManagedString encrypted = protocol.encrypt(msgString);
      //msgString = msgString + '|';
      encrypted = encrypted + '|';
      int size = msgString.length();
      uart->send(size);
      //Encrypt the msg.

      //Max number of bytes that can be sent per packet is 20.
      for(i = 0; i < msgString.length(); i++)
      {
        //Send eom.
        if(msgString.charAt(i) == eom)
        {
          uart->send('|');
          //Clear out old string.
          msgString = "";
          encrypted = "";
          break;
        }
        else
        {
          uart->send(encrypted.charAt(i));
        }
      }
      //Iterate through each member of msgString putting them into packets.
      msg = false;
    }
  }


  release_fiber();
}

//FUNCTIONS
//Connected via BLE to central.
void conn(MicroBitEvent e)
{
  uBit.display.print("C");
}

//Disconnected detected on BLE.
void dis(MicroBitEvent e)
{
  uBit.display.print("D");
}