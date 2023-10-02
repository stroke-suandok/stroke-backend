// import cors from '@fastify/cors';
// import fp from 'fastify-plugin';

// export default fp(async (fastify) => {
//     fastify.register(cors, {
//         origin: '*',
//     });
// });

import cors from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.register(cors, {
        origin: 'http://localhost:5173', // Replace with the actual origin of your frontend application
        credentials: true, // Allow credentials (cookies, HTTP authentication)
    });
});
