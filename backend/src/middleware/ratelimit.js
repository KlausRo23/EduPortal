import ratelimit from 'express-rate-limit'

export const globalLimit = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: "Slow down you're making so many request"
})

export const loginLimit = ratelimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    message: "Slow down you're logging in too fast"
})

export const registerLimit = ratelimit({
    windowMs: 2 * 60 * 1000,
    max: 3,
    message: "Slow down you're logging in too fast"
})

export const submitLimit = ratelimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    message: "Slow down you're making so many request"
})