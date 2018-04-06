//Authors: Gregory Jones + Sean Kearney
#include "msg.h"

msg::msg()
{

}

//Encrypt ascii string by a hardcoded key.
//Encryption method was a simgple shifting cypher.
ManagedString protocol::encrypt(ManagedString ascii)
{

	ManagedString encrypted = "";
	int key = 2;

	for (size_t i = 0; i < ascii.length(); i++)
	{
		if ((ascii.charAt(i) == '|'))
		{
			encrypted = encrypted + '|';
		}
		else if (ascii.charAt(i) == '/')
		{
			encrypted = encrypted + '/';
		}
		else if(ascii.charAt(i) == ' ')
		{
			encrypted = encrypted + ' ';
		}
		else
		{
			//Add the key value to the character meaning it will have a different ascii
			//value, then append it to the string.
			encrypted = encrypted + char((ascii.charAt(i) + key));
		}

	}
	return encrypted;
}

//Decrypt an ascii string.
//This uses the reverse of the encryption method.
ManagedString protocol::decrypt(ManagedString ascii)
{
	ManagedString decrypted = "";
	int key = -2;

	for (size_t i = 0; i < ascii.length(); i++)
	{
		if ((ascii.charAt(i) == '|'))
		{
			decrypted = decrypted + '|';
		}
		else if (ascii.charAt(i) == '/')
		{
			decrypted = decrypted + '/';
		}
		else if(ascii.charAt(i) == ' ')
		{
			decrypted = decrypted + ' ';
		}
		else
		{
			//Shift the character to its value and append it to the message.
			decrypted = decrypted + char((ascii.charAt(i) + key));
		}

	}
	return decrypted;
}
