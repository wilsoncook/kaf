import { Application } from './application';
import http = require('http');
import url = require('url');
import qs = require('querystring');

export class Request {

	public req: http.IncomingMessage;
	private app: Application;
	public url: string; //represent of current url(can be rewrited)

	private _queryString: string; //represent of current query string(can be rewrited)
	private _queryCache: Object; //cache of last query(for performance of fetching query object), syncronize with queryString
	
	constructor(req: http.IncomingMessage, app: Application) {
		this.req = req;
		this.app = app;

		this.url = req.url;
		this._queryString = url.parse(this.url).query;

		//test
		this.req.on('data', (chunk: Buffer) => {
			console.log('----Request-ondata', chunk.toString('utf-8'));
		});
		this.req.on('end', () => {
			console.log('----Request-onend');
		});
	}

	get method() { return this.req.method; }

	get length() {
		let length = parseInt(this.getHeader('content-length'));
		return isNaN(length) ? undefined : length;
	}

	get originalUrl() { return this.req.url; }

	get origin() { return `${this.protocol}://${this.host}`; }

	get href() { return this.origin + this.url; }

	get queryString() { return this._queryString; }
	set queryString(str) {
		this._queryString = str;
		this._queryCache = null; // clear cache
	}

	get queryStringFull() { return this.queryString ? '?' + this.queryString : this.queryString; }

	get host(): string {
		let host = this.getHeader('X-Forwarded-Host');
		if (host) { return host.split(/\s*,\s*/)[0]; }
		return this.getHeader('Host');
	}

	get hostname(): string { return this.host ? this.host.split(':')[0] : ''; }

	get protocol() {
		let proto = this.getHeader('X-Forwarded-Proto');
		if (proto) { return proto.split(/\s*,\s*/)[0]; }
		return 'http';
	}

	get socket() { return this.req.socket; }

	//header key-value pairs, header names are lower-cased, if name presents, then return the specified value string of `name` in header
	get headers() { return this.req.headers; }

	/**
	 * get single header
	 * @param {string} field
	 * @returns
	 * @memberOf Request
	 */
	getHeader(field: string) { return this.req.headers[field.toLowerCase()] || ''; }

	/**
	 * parsed query-string, return empty Object when no query-string is present. (NOTE: both keys and values are decoded)
	 * @param {(Object|string)} [key]
	 * @param {*} [value]
	 * @returns
	 * @memberOf Request
	 */
	query(key?: Object|string, value?: any) {
		let query = this._queryCache = this._queryCache || qs.parse(this.queryString); //initialize query cache
		if (key) {
			if ('string' === typeof key) {
				if (2 === arguments.length) { //get
					return query[key];
				} else { //set single
					query[key] = value;
					return this.queryString = qs.stringify(query);
				}
			} else if ('object' === typeof key) { //set whole
				return this.queryString = qs.stringify(key);
			}
		} else {
			return query;
		}
	}

}

export default Request;