import assert = require('assert');
import http = require('http');
import statuses = require('statuses');
import Stream = require('stream');
import { Application } from './application';

const contentType = require('mime-types').contentType;

class Response {
	
	public res: http.ServerResponse;
	public app: Application;

	private _headers: Object;
	private _body: BodyType;

	constructor(res: http.ServerResponse, app: Application) {
		this.res = res;
		this.app = app;
	}

	setHeader(name: string, value: string | string[]): void { this.res.setHeader(name, value); }
	getHeader(name: string): string { return this.res.getHeader(name); }
	removeHeader(name: string): void { this.res.removeHeader(name); }

	get status() { return this.res.statusCode; }
	set status(code: number) {
		assert('number' === typeof code, 'The status code must be a number.');
		let message = statuses[code];
		assert(message, 'Invalid status code.');
		this.res.statusCode = code;
		this.res.statusMessage = message;
		//TODO empty the body
	}

	//set Content-Type through the `mime-types` module (Suppling an invalid type will cause Content-Type header being removed)
	set type(type: string) {
		type = contentType(type);
		if (type) {
			this.setHeader('Content-Type', type);
		} else {
			this.removeHeader('Content-Type');
		}
	}

	//set or remove Content-Length
	set length(length: number) {
		if (-1 === length) {
			this.removeHeader('Content-Length');
		} else {
			this.setHeader('Content-Length', '' + length);
		}
	}

	get body() { return this._body; }
	set body(data: BodyType) {
		//should set new type?
		let shouldSetType = !this.getHeader('Content-Type');
		
		if (!data) { //no content: null/undefined/""/0/false
			this.status = 204;
			this.removeHeader('Content-Type');
			this.removeHeader('Content-Length');
			this.removeHeader('Transfer-Encoding');
		} else if ('string' === typeof data) { //normal text/html
			if (shouldSetType) { this.type = /\s*</.test(data) ? 'html' : 'text'; }
			this.length = Buffer.byteLength(data);
		} else if (Buffer.isBuffer(data)) { //buffer
			if (shouldSetType) { this.type = 'bin'; }
			this.length = (<Buffer>data).length;
		} else if (data instanceof Stream) { //stream
			if (shouldSetType) { this.type = 'bin'; }
			data.pipe(this.res);
			this.length = -1; //remove length header
			//listen error
			if (data.listeners('error').indexOf()) {

			}
		} else { //json
			if (shouldSetType) { this.type = 'json'; }
			data = JSON.stringify(data);
			this.length = Buffer.byteLength(<string>data);
		}

		this._body = data;
	}

	//output response
	output() {

	}

}

/*
--------------------------------------------------------------------
| Definitions
--------------------------------------------------------------------
*/

export type BodyType = string | Buffer | Object | Stream.Readable | Stream.Duplex | Stream.Transform;

export default Response;