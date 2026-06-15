import User from '../models/modelUser.js'
import jwt from 'jsonwebtoken'


const perfils = ['cliente', 'petshop', 'admin']


export const autenticar = async (req, res, next) => {

    // if(!req.session.usuario)return res.redirect('/login')

    // const usuario = await User.findById(req.session.usuario.id)
    // if (!usuario){
    //     req.session.destroy (() => {})
    //     return res.status(401).json({msg: 'Usuário não encontrado'})

    // }

    if(!req.cookies.token)return res.redirect('/login')
        try{
            // Use process.env.JWT_SECRET para consistência com o login
            const usuario = jwt.verify(req.cookies.token, process.env.JWT_SECRET || 'JWT_SECRET')
            req.usuario = usuario
        }catch(err){
            return res.redirect('/login')
        }
    
      
        next()
}


export function validarPerfil (perfils){

    return (req, res, next) => {
        // const perfil = req.session.usuario.perfil
        const perfil = req.usuario.perfil
        if (!perfils.includes(perfil)) return res.status(403).json({msg:'Acesso negado'})

        next()
    }
}

export const apagarCache = (req,res,next) => {
    res.set('Cache-Control', 'no-store,no-cache, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0') 
    next()
}