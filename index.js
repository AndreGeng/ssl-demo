/**
 * @see https://www.akadia.com/services/ssh_test_certificate.html
 * @see https://www.openssl.org/docs/manmaster/man1/x509.html
 * @see https://wiki.openssl.org/index.php/Manual:Req(1)
 * @see https://coolaj86.com/articles/asymmetric-public--private-key-encryption-in-node-js/
 */
const config = require('./config');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const execPromise = function(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout) => {
			if (err) {
				return reject(err);
			};
			resolve(stdout);
		});
	});
}
const generateDistDir = `mkdir ${config.distDir}`;

// const generatePrivateKeyCmd = `openssl genrsa -des3 -passout pass:${config.pwd} -out ${config.privateKeyName} 1024`;
// const generateCSRCmd = `openssl req -new -key ${config.privateKeyName} -config ${config.csrConfigFile} -out ${config.csrName}`;
// const generateSelfSignedCrt = `openssl x509 -req -days 365 -in ${config.csrName} -signkey ${config.privateKeyName} -passin pass:${config.pwd} -out ${config.certificateName}`;
// const cmds = [generateDistDir, generatePrivateKeyCmd, generateCSRCmd, generateSelfSignedCrt];

const generatePrivateKeyCmd = `openssl genrsa -des3 -passout pass:${config.pwd} -out ${config.privateKeyName} 1024`;
const generatePublicKeyFromPrivateKey = `openssl rsa -in ${config.privateKeyName} -passin pass:${config.pwd} -pubout -out ${config.publicKeyName}`;
const cmds = [generateDistDir, generatePrivateKeyCmd, generatePublicKeyFromPrivateKey];

(async () => {
	for (const cmd of cmds) {
		await execPromise(cmd);
	}
})();

process.stdout.write('Please input text need to be encryted:');
process.stdin.setEncoding('utf8');
let textTobeEncrypted = '';
process.stdin.once('data', (text) => {
	textTobeEncrypted += text;
	console.log(`received text: ${textTobeEncrypted}`);
	console.log('start encryt...');
	const encryted = crypto.publicEncrypt({
		// key: fs.readFileSync(path.resolve(__dirname, config.certificateName), 'utf8'),
		key: fs.readFileSync(path.resolve(__dirname, config.publicKeyName), 'utf8'),
	}, new Buffer(textTobeEncrypted));
	const encrytedText = encryted.toString('base64');
	console.log(`encryted data: ${encrytedText}`);
	console.log('start decryt...');
	const decrypted = crypto.privateDecrypt({
		key: fs.readFileSync(path.resolve(__dirname, config.privateKeyName), 'utf8'),
		passphrase: config.pwd,
	}, new Buffer(encrytedText, 'base64'));
	console.log(`decrypted data: ${decrypted.toString('utf8')}`);
	process.exit(0);
});



// openssl genrsa -des3 -passout pass:123456 -out server.key 1024
// openssl req -new -key server.key -config server.csr.cnf -out server.csr
// openssl x509 -req -days 365 -in server.csr -signkey server.key -passin pass:123456 -out server.crt
