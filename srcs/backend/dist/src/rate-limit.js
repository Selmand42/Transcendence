/**
 * Basit in-memory rate limiter. Her IP + rota için belirlenen süre boyunca isteği sınırlar.
 * Geliştirme ortamı için yeterli; production'da paylaşımlı store (Redis vb.) önerilir.
 */
export const createRateLimiter = (options) => {
    const hits = new Map();
    const { limit, windowMs, keyGenerator, errorMessage } = options;
    const getKey = (request) => {
        if (keyGenerator) {
            return keyGenerator(request);
        }
        // Fastify request.ip reverse proxy arkasında çalışırken gerçek IP'yi tutar (trustProxy ayarına göre).
        const ip = request.ip ?? request.headers['x-forwarded-for'] ?? 'unknown';
        const route = request.routeOptions?.url ?? request.raw.url ?? '';
        return `${ip}:${route}`;
    };
    return async (request, reply) => {
        const key = getKey(request);
        const now = Date.now();
        const bucket = hits.get(key);
        if (!bucket || bucket.expiresAt <= now) {
            hits.set(key, { count: 1, expiresAt: now + windowMs });
            return;
        }
        if (bucket.count >= limit) {
            await reply.status(429).send({
                error: 'TooManyRequests',
                message: errorMessage ?? 'Çok fazla deneme yaptın, lütfen biraz bekle.'
            });
            return reply;
        }
        bucket.count += 1;
    };
};
