// this computes x to the power of y modulo z - we need a special function for this for very large numbers: do NOT use (x ** y) % z
// it takes three numbers as inputs and returns a number
function modulo(x, y, z) {
	r = 1;
	while (y > 0) {
		if (y % 2 == 1) {
			r = (r * x) % z;		}
		y = Math.floor(y / 2); 
		x = (x * x) % z;
	}
	return r;
}

// this will return the totient function of inputs p and q
// it takes two numbers as inputs and returns a number
function totient(p,q) {
	if ((p <= 1) || (q <= 1)) {
		return "Inputs need to be larger!";
	}

	return ((p - 1) * (q - 1))*(1/gCD(p - 1, q -1));
}

// this will return a random exponent used for encryption from a number n
// it takes a number as input and returns a number
function genExp(n) {
	function isPrime(n) {
		if (n < 2) {
			return false;
		}
		for (var i = 2; i <= Math.round(Math.sqrt(n)); i++) {
			if (n % i == 0) {
				return false;
			}
		}
		return true;
	}
	var stop = false; 
	while (!stop) {
		var num = 2 + Math.round((n-3)*Math.random());
		if (isPrime(num) && (gCD(n,num) == 1)) {
			return num;
		}
	}
}

// this computes the modular multiplicative inverse of a mod m, used in generating the private key
// it takes two numbers as inputs and returns a number
function genInverse(a,m) {
	var b = m;
   	var x = 0;
   	var y = 1;
   	var u = 1;
   	var v = 0;

   	while (a !== 0) {
   		var q = Math.floor(m / a);
   		var r = m % a;
   		var p = x - (u * q);
   		var n = y - (v * q);
   		m = a;
   		a = r;
   		x = u;
   		y = v;
   		u = p;
   		v = n;
   	}

 	var out = [m, x, y];
 	if (out[1] < 0) {
 		out[1] = b + out[1];
 	}
 	return out[1];
}




////////////////////////
////////////////////////
// The following will generate a public key and a private key from the random generation of prime numbers

// ADD ANY OTHER NECESSARY FUNCTIONS HERE

function genIntegers(n) {
	var array = [];
	for (var i = 2; i <= n; i++) {
		array[i-2] = [i,true];
	}
	for (var i = 2; i <= Math.ceil(Math.sqrt(n)); i++) {
		if (array[i-2][1]) {
			for (var j = 2; j <= n / i; j++) {
				array[(i*j) - 2][1] = false;
			}
		}
	}
	return array;
}

function genPrimes(n) {
// this should return an array
	var array = genIntegers(n);
	var primeArray = [];

	for(var i = 0; i < array.length; i++){
		if(array[i][1] === true){
			primeArray.push(array[i][0])
		}
	}
	return primeArray;
}

// console.log(genIntegers(12));

function genPairPrimes(len) {
	// this should return an array of two elements, where each element is a randomly generated prime number with len digits
	var n = 10**len;

	var m = 10**(len-1);

	var array = genPrimes(n);

	for(var i = 0; i < array.length; i++){
		if(array[i] < m){
			array.splice(i,1);
		}
	}

	var out = [];

	var prime1 = 0;

	var prime2 = 0;

	while(prime1 == prime2){
		prime1 = Math.floor(Math.random() * array.length)
		prime2 = Math.floor(Math.random() * array.length)

	}

	out.push(array[prime1],array[prime2]);

	return out;
}

// console.log(genPairPrimes(2));

function gCD(a,b) {
	// this should return a number, which is the greatest common divisor of two numbers, a and b
	var c;

	while(b !== 0){
		c = b;
		b = a % b;
		a = c;
	}
	return a;
}
// console.log(gCD(85,153));

function genPublicKey(prime1,prime2) {
	// this should return an array of two elements, where the first element is the product of the primes (prime1 and prime2) and the second element is what's returned by genExp for particular inputs
	var public = [];

	var public1 = prime1 * prime2;

	var public2 = genExp(totient(prime1, prime2));

	public = [public1, public2];

	return public;

}

var primes = genPairPrimes(3);
var publicKey = genPublicKey(primes[0],primes[1]);
// console.log(publicKey);

function genPrivateKey(product,exponent,totient) {
	// this should return an array of two elements, where the first element is the product of the primes (prime1 and prime2) and the second element is what's returned by genInverse for particular inputs
	var private = [product, genInverse(exponent, totient)];

	return private;
}


var privateKey = genPrivateKey(primes[0] * primes[1], publicKey[1], totient(primes[0], primes[1]));
// console.log(privateKey);

var table = ["e", "t", "a", "i", "n", "o", "s", "h", "r", , "d", "l", "u", "c", "m", "f", "w", "y", "g", , "p", "b", "v", "k", "q", "j", "x", "z"];

function encode(string) {
	// this should return a number from a string, which will be the word we wish to encode using table
	var length = string.length;

	var output = "";

	for(var i = 0; i < length; i++){
		for(var j = 0; j < table.length; j++){
			if(string.charAt(i) == table[j]){
				output = output + (j + 1) + 0;
			}
		}
	}

	return Math.floor(parseInt(output) / 10);
}

// console.log(message);
// console.log(typeof message);

function encrypt(number, publicKey) {
	// this will produce a new encrypted number using the publicKey
	var enc = modulo(number, publicKey[1], publicKey[0]);

	return enc;
}

var word = "hi";
var message = encode(word);
// console.log(message);
message = encrypt(message, publicKey);
// console.log(message);

// The following will decrypt messages

function decrypt(message,privateKey) {
	// this will return a number from the input parameters message and privateKey
	var dec = modulo(message, privateKey[1], privateKey[0]);

	return dec;
}
var plain = decrypt(message, privateKey);
// console.log(plain);
 
// this will convert numbers into words
function convertToText(number) {
	// when completed this will return a string which is the initial word encoded above
	var string = "";
	string = string + number;
	var n = string.length;
	var i = 0;
	var word = "";
	while (i < n) {
		var num = "";
		while (string.charAt(i) != 0) {
			num = num + string.charAt(i);
			i++;
		}
		num = parseInt(num);
		word = word + table[num - 1];
		i++;
	}
	return word;
}
plain = convertToText(plain);
console.log(plain);
	