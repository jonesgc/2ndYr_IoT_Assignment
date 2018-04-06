#ifndef PROTOCOL_H
#define PROTOCOL_H

//Authors: Gregory Jones, Sean Kearney

#include <string>
#include <vector>

class protocol
{
public:
	//Constructor
	protocol();

	//Destructor
	~protocol();


	//Decode the morse string into characters.
	ManagedString deCodeMorse(ManagedString);

	//Encode ascii into morse
		ManagedString encodeAscii(ManagedString);

	//Encrypt Ascii string
	ManagedString encrypt(ManagedString);

	//Decrypt Ascii string
	ManagedString decrypt(ManagedString);

private:
	char morseToAscii(ManagedString);

	ManagedString asciiToMorse(char);
};
#endif
