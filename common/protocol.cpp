//Authors: Gregory Jones + Sean Kearney
#include "protocol.h"
#include <string>

//Constructor
protocol::protocol()
{
}
//Destructor
protocol::~protocol()
{
}

//Decode the morse code string into ascii characters.
ManagedString protocol::deCodeMorse(ManagedString morse)
{
	ManagedString decoded;
	ManagedString substr;
	bool space = true;

	for (size_t i = 0; i < morse.length(); i++)
	{
		//Do not encrypt grammar characters.
		if ((morse.charAt(i) == '|') || (morse.charAt(i) == '/'))
		{
			decoded = decoded + morseToAscii(substr);

			if (morse.charAt(i) == '|')
			{
				decoded = decoded + '|';
				break;
			}
			else
			{
				decoded = decoded + '/';
			}
			//First space is between characters.
			if (space == true)
			{
				decoded = decoded + morseToAscii(substr);
				substr = "";
				space = false;
			}
			else
			{
				space = true;
				substr = "";
			}
		}
		else if (morse.charAt(i) == ' ')
		{
			if (space)
			{
				decoded = decoded + morseToAscii(substr);
				substr = "";
				space = false;
			}
			else
			{
				space = true;
				decoded = decoded + ' ';
				substr = "";
			}
		}
		else
		{
			//Add characters to be decoded.
			substr = substr + morse.charAt(i);
		}

	}

	return decoded;
}
//Encode ascii characters into morse strings.
ManagedString protocol::encodeAscii(ManagedString ascii)
{
	ManagedString encoded = "";
	ManagedString substr;

	for (size_t i = 0; i < ascii.length(); i++)
	{
		if ((ascii.charAt(i) == '|'))
		{
			encoded = encoded + '|';
		}
		else if (ascii.charAt(i) == '/')
		{
			encoded = encoded + '/';
		}
		else if (ascii.charAt(i) == ' ')
		{
			encoded = encoded + ' ';
		}
		else
		{
			//After every addition add a space to ensure proper decoding.
			encoded = encoded + asciiToMorse(ascii.charAt(i));
			encoded = encoded + ' ';
		}

	}

	return encoded;
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

//This function holds the assciation between morse code strings and their ascii counter parts.
char protocol::morseToAscii(ManagedString morse)
{
	char ascii =0;

	if (morse == ".-")
		ascii = 'A';
	if(morse == "-...")
		ascii = 'B';
	if (morse == "-.-.")
		ascii = 'C';
	if (morse == "-..")
		ascii = 'D';
	if (morse == ".")
		ascii = 'E';
	if (morse == "..-.")
		ascii = 'F';
	if (morse == "--.")
		ascii = 'G';
	if (morse == "....")
		ascii = 'H';
	if (morse == "..")
		ascii = 'I';
	if (morse == ".---")
		ascii = 'J';
	if (morse == "-.-")
		ascii = 'K';
	if (morse == ".-..")
		ascii = 'L';
	if (morse == "--")
		ascii = 'M';
	if (morse == "-.")
		ascii = 'N';
	if (morse == "---")
		ascii = 'O';
	if (morse == ".--.")
		ascii = 'P';
	if (morse == "--.-")
		ascii = 'Q';
	if (morse == ".-.")
		ascii = 'R';
	if (morse == "-")
		ascii = 'T';
	if (morse == "..-")
		ascii = 'U';
	if (morse == "...-")
		ascii = 'V';
	if (morse == ".--")
		ascii = 'W';
	if (morse == "-..-")
		ascii = 'X';
	if (morse == "-.--")
		ascii = 'Y';
	if (morse == "--..")
		ascii = 'Z';
	if (morse == ".-.-.-")
		ascii = '.';
	if (morse == "--..--")
		ascii = ',';
	if (morse == "---...")
		ascii = ';';
	if (morse == "..--..")
		ascii = '?';
	if (morse == ".----.")
		ascii = '\'';
	if (morse == "-....-")
		ascii = '-';
	if (morse == "-..-.")
		//ascii = '/';
	if (morse == "-.--.-")
		ascii = '(';
	if (morse == ".-..-.")
		ascii = '"';
	if (morse == ".--.-.")
		ascii = '@';
	if (morse == "-...-")
		ascii = '=';

	return ascii;
}

//This function maps ascii to morse code strings.
ManagedString protocol::asciiToMorse(char ascii)
{

	if (ascii == 'A')
		return ".-";
	if (ascii == 'B')
		return "-...";
	if (ascii == 'C')
		return "-.-.";
	if (ascii == 'D')
		return "-..";
	if (ascii == 'E')
		return ".";
	if (ascii == 'F')
		return "..-.";
	if (ascii == 'G')
		return "--.";
	if (ascii == 'H')
		return "....";
	if (ascii == 'I')
		return "..";
	if (ascii == 'J')
		return ".---";
	if (ascii =='K')
		return  "-.-";
	if (ascii == 'L')
		return  ".-..";
	if (ascii == 'M')
		return "--";
	if (ascii == 'N')
		return "-.";
	if (ascii == 'O')
		return "---";
	if (ascii == 'P')
		return ".--.";
	if (ascii == 'Q')
		return "--.-";
	if (ascii == 'R')
		return ".-.";
	if (ascii == 'T')
		return "-";
	if (ascii == 'U')
		return "..-";
	if (ascii == 'V')
		return "...-";
	if (ascii == 'W')
		return ".--";
	if (ascii == 'X')
		return "-..-";
	if (ascii == 'Y')
		return "-.--";
	if (ascii == 'Z')
		return "--..";
	if (ascii == '.')
		return ".-.-.-";
	if (ascii == ',')
		return "--..--";
	if (ascii == ';')
		return "---...";
	if (ascii == '?')
		return "..--..";
	if (ascii == '\'')
		return ".----.";
	if (ascii == '-')
		return "-....-";
	if (ascii == '/')
		return "-..-.";
	if (ascii == '(' || ')')
		return  "-.--.-";
	if (ascii = '"')
		return  ".-..-.";
	if (ascii == '@')
		return  ".--.-.";
	if (ascii == '=')
		return  "-...-";

}
