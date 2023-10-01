const Fastify = require('fastify');
const cachet = require('../dist/index.js');
const cachetOptions = {
  param: 'v',
  cache: 'no-store',  
  ext: ['js','css']
}

const cachetHandler = cachet(cachetOptions)

const fastify = Fastify({})

async function start() {
  await fastify.register(require('@fastify/express'))

  fastify.use(cachetHandler)

  // Declare a route
  fastify.use((req, reply, done) => {
    reply.send(`Response from ${req.originalUrl}`)
    done()
  });

  // Run the server!
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()