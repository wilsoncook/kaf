import Request from './request';
import Response from './response';
import http = require('http');
import assert = require('assert');

export class Application {

	private server: http.Server;
	private middlewares: Middleware[] = []; //middleware queue

	constructor() {
		if (!(this instanceof Application)) { return new Application(); } //for directly call
	}

	use(handler: MiddlewareHandler): void {
		if ('function' !== typeof handler) { throw new TypeError(`Supplied parameter needs the type of "function", but type ${typeof handler} given.`); }
		this.middlewares.push({
			handler: handler
		});
	}

	async handler(req: http.IncomingMessage, res: http.ServerResponse) {
		try {
			//packaging as Request and Response
			let wrappedReq = new Request(req, this), wrappedRes = new Response(res, this), lastResult;
			//run queue
			for (let middleware of this.middlewares) {
				lastResult = await middleware.handler(wrappedReq, wrappedRes, lastResult);
				console.log('----ffff', lastResult);
				if (false === lastResult) { break; }
			}
			//output response
			//TODO
		} catch (err) {
			console.log('------uncaught error from handler()', err);
		}
	}

	//Wrapper for nodejs's Server.listen
	listen() {
		var server = this.server = http.createServer(this.handler.bind(this));
		server.listen.apply(server, arguments);
	}

}

/*
--------------------------------------------------------------------
| Definitions
--------------------------------------------------------------------
*/

export type MiddlewareHandler = (req: Request, res: Response, lastResult?: any) => any;
export interface Middleware {
	order?: number; //[reserved]execution order (by ASC)
	handler: MiddlewareHandler; //the execution function
	label?: string; //[reserved]label comment for this Middleware
}