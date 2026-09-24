// www.bip39.ai → https://bip39.ai (301), keeping path and query.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = 'bip39.ai';
    url.port = '';
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  },
};
