#include "MicroBit.h"
#include "MicroBitUARTService.h"

MicroBit uBit;
MicroBitUARTService *uart;

//PROTOTYPES
void conn(MicroBitEvent e);
void dis(MicroBitEvent e);

int main()
{
  uBit.init();
  new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);

  //Listen for connection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, conn);
  //Listen for disconnection.
  uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, dis);

  //Button listeners.
  MicroBitButton buttonA(MICROBIT_PIN_BUTTON_A, MICROBIT_ID_BUTTON_A);
  MicroBitButton buttonB(MICROBIT_PIN_BUTTON_B, MICROBIT_ID_BUTTON_B);

  //Message loop, get input from Microbit till end of message (EOM).
  bool msg = false;
  while(msg == false)
  {
    //Flash the current character in the alphabet.
    uBit.display.print('A');
    uBit.sleep(1000);
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
