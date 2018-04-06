//Challenge 3 resource file for message passing.
//Authors: Gregory Jones + Sean Kearney
#ifndef MSG_H
#define MSG_H

class msg
{
public:
	//Constructor
	msg();

	//Destructor
	~msg();

	//Encrypt Ascii string
	ManagedString encrypt(ManagedString);

	//Decrypt Ascii string
	ManagedString decrypt(ManagedString);
private:

};
#endif
