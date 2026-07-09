import ratelimit from 'express-rate-limit'

export const globalLimit = ratelimit({
    windowMs: 5 * 100 * 60,
    max: 100,
    message: "Slow down you're making so many request"
})

export const loginLimit = ratelimit({
    windowMs: 2 * 100 * 60,
    max: 10,
    message: "Slow down you're logging in too fast"
})