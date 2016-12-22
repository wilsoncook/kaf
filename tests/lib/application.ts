import assert = require('assert');
import http = require('http');
import { Application } from '../../lib/application';

// let app: Application = new Application();
// app.use((req, res) => {
// 	console.log('------handler:', req.headers);
// 	res.res.writeHead(200, 'OK', {
// 		'Content-Type': 'text/plain',
// 		'Content-Length': 4
// 	});
// 	res.res.write('1234');
// });
// app.listen(3001);

// console.log('-----run');
// // let postData = 'TEST';
// let options = {
// 	hostname: '127.0.0.1',
// 	port: 3001,
// 	path: '/',
// 	method: 'GET',
// 	headers: {
// 		'Connection': 'Keep-Alive'
// 		// 'Content-Type': 'application/x-www-form-urlencoded',
// 		// 'Content-Length': Buffer.byteLength(postData)
// 	}
// };
// // let options = 'http://127.0.0.1:3001';
// let req: http.ClientRequest = http.request(options, (res) => {
// 	console.log('-----------sssssss', res.headers);
// 	console.log('----------ccccc', res.statusCode, res.statusMessage);
// 	res.on('data', (chunk: Buffer) => console.log('chunk:\n', chunk.toString('utf-8')));
// 	// res.setEncoding('utf-8');
// 	// setInterval(function() {
// 	// 	let data = res.read();
// 	// 	console.log('chunk:\n', data);
// 	// }, 1000);
	
// 	res.on('end', () => {
// 		console.log('----END');
// 	});
// });
// // req.on('error', (err) => {
// // 	console.log('----error: ', err.stack);
// // });
// // req.write(postData);
// req.flushHeaders();

// // setInterval(() => {
// // 	req.write('test');
// // }, 1000);

// // req.end();

describe('Application', function() {
	let app: Application;
	before(function() {
		console.log('----before');
		app = new Application();
	});
	// beforeEach(async () => {
	// 	console.log('-----beforeEach');
	// 	return await new Promise((resolve, reject) => {
	// 		setTimeout(() => resolve('aaaa'), 1000);
	// 	});
	// });
	describe('use() middlewares', function() {
		it('should throw TypeError of handler', function() {
			assert.throws(() => app.use(null), TypeError);
			assert.throws(() => app.use(undefined), TypeError);
			assert.throws(() => app.use(function(){}), TypeError);
		});
		it('should not throw error', function() {
			assert.doesNotThrow(function() {
				app.use(function(req, res) {
					console.log('----test', req.href);
				});
			});
		});
		it('should reponsed as "OK"', function(done) {
			app.use((req, res) => {
				res.end('TEST OK');
			});
			app.listen(3001);
			//request
			http.request('http://127.0.0.1:3001', (res) => {
				console.log('-----------sssssss', res.headers);
				console.log('----------ccccc', res.statusCode, res.statusMessage);
				res.setEncoding('utf-8');
				res.on('data', (chunk) => {
					if (chunk === 'TEST OK') {
						done();
					} else {
						done(new Error('Invalid response.'));
					}
					console.log('chunk:\n', chunk);
				});
				res.on('end', () => {
					console.log('----END');
				});
			});
		});
	});
});