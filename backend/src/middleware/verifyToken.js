import jwt, { decode } from 'jsonwebtoken'
import User from '../model/User.js'

export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            console.log('[Auth] Missing or malformed Authorization header')

            return res.status(401).json({
                success: false,
                message: 'Access token is invvvalid or missing'
            })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)

        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
                return res.status(401).json({
                success: false,
                message: 'User not found',
            })
        }

        req.user = user
        req.userId = user._id
        req.username = user.username
        req.role = user.role

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Session expired. Please log in again.',
        })
        }

        if (error.name === 'JsonWebTokenError') {
        console.error('[Auth] JWT verification failed:', {
            error: error.message,
            endpoint: req.path,
            method: req.method,
        })
        return res.status(403).json({
            success: false,
            message: 'Invalid token',
        })
        }

        console.error('[Auth] Error in authenticate middleware:', error)
        return res.status(500).json({
        success: false,
        message: 'Authentication error',
        })
    }
}