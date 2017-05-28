const config = {
	pwd: 123456,
	csrConfigFile: 'server.csr.cnf',
	distDir: 'dist',
}
config.privateKeyName = `${config.distDir}/private.key`;
// config.csrName = `${config.distDir}/server.csr`;
// config.certificateName = `${config.distDir}/server.crt`;
config.publicKeyName = `${config.distDir}/public.pem`;

module.exports = config;
