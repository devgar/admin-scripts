#!/usr/bin/env node

function gen_route(handler, arg, host) {
  const id = handler === redirect
    ? `redirects_${arg}`
    : Array.isArray(host)
    ? host[0]
    : host

  return {
    '@id': id,
    handle: [handler(arg)],
    match: [match_host(host)]
  }
}

function file_server(root) {
  return {
    "handler": "file_server",
    "hide": ["/etc/caddy/Caddyfile"],
    "root": root ?? "/var/www/default"
  }
}

function reverse_proxy(dial) {
  return {
    "handler": "reverse_proxy",
    "upstreams": [{
      "dial": (dial ? `:${dial}` : ':3000')
    }]
  }
}

function redirect(host) {
  return {
    "handler": "static_response",
    "headers": {
      "Location": [
        `https://${host}{http.request.uri}`
      ]
    },
    "status_code": 302
  }
}

function match_host(host) {
  return {
    "host": (Array.isArray(host) ? host : [host])
  }
}

module.exports = {
  file_server,
  redirect,
  reverse_proxy
}

if (require.main === module) {
  if (process.argv.length < 5) {
    console.error(`Usage: ${process.argv[1]} HANDLER_TYPE HANDLER_ARG HOST`)
    console.error('Args:', process.argv)
    process.exit(1)
  }

  const handler = module.exports[process.argv[2]]

  if (!handler) {
    console.error(`Handler unavailable use one of this:`)
    for (let k of Object.keys(module.exports)) {
      console.error('  -', k)
    }
    process.exit(1)
  }

  console.log(JSON.stringify(
    gen_route(module.exports[process.argv[2]], ...process.argv.slice(3)),
    null,
    2
  ))
}
