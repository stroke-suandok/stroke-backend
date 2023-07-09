import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

declare module 'fastify' {
    // interface EventMessage {
    //     /**
    //      * Message payload
    //      */
    //     data?: string;
    //     /**
    //      * Message identifier, if set, client will send `Last-Event-ID: <id>` header on reconnect
    //      */
    //     id?: string;
    //     /**
    //      * Message type
    //      */
    //     event?: string;
    //     /**
    //      * Update client reconnect interval (how long will client wait before trying to reconnect).
    //      */
    //     retry?: number;
    //     /**
    //      * Message comment
    //      */
    //     comment?: string;
    // }
    // interface FastifyReply {
    //     sseContext: { source: Pushable<EventMessage> };
    //     sse(source: EventMessage): void;
    // }

    export interface FastifyInstance {
        sseSubscribers: any[];
    }
}

//seems like fastify removed EventMessage in recent release so this is replacement for that
interface EventMessage {
    /**
     * Message payload
     */
    data?: string;

    /**
     * Message identifier, if set, client will send `Last-Event-ID: <id>` header on reconnect
     */
    id?: string;

    /**
     * Message type
     */
    event?: string;

    /**
     * Update client reconnect interval (how long will client wait before trying to reconnect).
     */
    retry?: number;

    /**
     * Message comment
     */
    comment?: string;
}

const subscribers: any[] = [];
const topic = ['init-connection', 'message'];
export default fp(async (fastify, opts) => {
    fastify.decorate('sseSubscribers', subscribers);
});

export function sseEventHandler(request: FastifyRequest, reply: FastifyReply) {
    console.log(request);
    Object.entries(reply.getHeaders()).forEach(([key, value]) => {
        reply.raw.setHeader(key, value ?? '');
    });
    reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('Cache-Control', 'no-cache,no-transform');
    reply.raw.setHeader('x-no-compression', 1);
    // reply.raw.end();
    // sendSSE(reply);

    // Generate subscriber data bind process id with HTTP response object
    // After client opens connection send uuid (process Id)
    const processId = uuidv4().substring(0, 8);
    const initSubscribeData = {
        processId,
        startProcessAt: Date.now(),
        type: topic[0],
    };

    reply.raw.write(
        serializeSSEEvent({ data: JSON.stringify(initSubscribeData) }),
    );

    const newSubscriber = {
        processId,
        reply,
    };
    subscribers.push(newSubscriber);

    request.socket.on('close', () => {
        console.log(
            '----------------------------close--------------------------',
        );
        console.log(`${processId} connection closed`);
        request.server.sseSubscribers = request.server.sseSubscribers.filter(
            (s) => s.processId !== processId,
        );
        reply.raw.end();
    });
}

// function sendSSE(res: FastifyReply) {
//     res.raw.write(serializeSSEEvent({ data: 'hello' }));
//     setTimeout(() => sendSSE(res), 3000);
// }

export function serializeSSEEvent(chunk: EventMessage): string {
    let payload = '';
    if (chunk.id) {
        payload += `id: ${chunk.id}\n`;
    }
    if (chunk.event) {
        payload += `event: ${chunk.event}\n`;
    }
    if (chunk.data) {
        payload += `data: ${chunk.data}\n`;
    }
    if (chunk.retry) {
        payload += `retry: ${chunk.retry}\n`;
    }
    if (chunk.comment) {
        payload += `:${chunk.comment}\n`;
    }
    if (!payload) {
        return '';
    }
    payload += '\n';
    return payload;
}
