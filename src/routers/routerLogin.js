import express from 'express'
import { login, validarLogin, logout, recuperarSenha, validarEmailRecuperacao, novaSenha } from '../controllers/controllerLogin.js'

const router = express.Router()

router.get('/login', login)
router.post('/login', validarLogin)
router.get('/logout', logout)
router.get('/recuperarSenha', recuperarSenha)
router.post('/recuperarSenha', validarEmailRecuperacao)
router.post('/novaSenha', novaSenha)

export default router