#include "MicroBit.h"
#include "MicroBitUARTService.h"

MicroBit uBit;
MicroBitUARTService *uart;

//PROTOTYPES
void conn(MicroBitEvent e);
void dis(MicroBitEvent e);
void scroll(MicroBitEvent e);

//Need to the global for displaying character for user input.


//Button listeners.
MicroBitButton buttonA(MICROBIT_PIN_BUTTON_A, MICROBIT_ID_BUTTON_A);
MicroBitButton buttonB(MICROBIT_PIN_BUTTON_B, MICROBIT_ID_BUTTON_B);

int main()
{
  uBit.init();
   uart = new MicroBitUARTService(*uBit.ble, 32, 32);
  //Listen for connection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, conn);
  //Listen for disconnection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, dis);
  char inChar = 65;

  //Message loop, broken when eom '|' (124) is entered.
  bool msg = false;
  bool lock = false;
  while(msg == false)
  {
    while(buttonA.isPressed())
    {
      //Increment once per click, by use of the lock.
      if(!lock)
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
      if(!lock)
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
    }
    lock = false;
    //Display ascii character on display, btn a to go forward, btn b to go back.
    //Wrap around the ends, a limted character set is used.
    uBit.display.print(inChar);
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
