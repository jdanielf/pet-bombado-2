        import User from '../models/modelUser.js'
        import path from 'path'
        import bcrypt from 'bcrypt'
        import session from 'express-session'
        import jwt from 'jsonwebtoken'
          
        const __dirname = path.resolve()



        export const login = (req, res) => {
            res.sendFile(path.join(__dirname, 'src', 'public', 'login.html'))
        }


        export const validarLogin = async (req, res) => {
            const{email, senha} = req.body
            if(!email || !senha) return res.status(400).json({mensagem: "Preencha todos os campos!"})
            try{

                const usuario = await User.findOne({where: {email: email}})
                if(!usuario) return res.status(400).json({mensagem: "Usuário não encontrado!"})
                
        
            const senhaDescript = await bcrypt.compare(senha, usuario.senha)
            // console.log(senhaDescript)
            if(!senhaDescript ) return res.status(400).json({mensagem: "Senha Inválida!"})

                // req.session.regenerate((err) =>  {
                //     if(err) return res.status(500).json({mensagem: 'Erro no servidor!'})

                //     req.session.usuario = {
                //         id: usuario.idUser,
                //         nome: usuario.nome,
                //         email: usuario.email,
                //         perfil: usuario.perfil
                //     }

                //     return res.render('index', {usuario: usuario.nome, title: 'Carteira de Pets',
                //         subtitle: 'Registre vacinas, banho, tosa e serviços para cães e gatos'})
                // })


                const token =jwt.sign(
                    {
                       id: usuario.idUser,
                        nome: usuario.nome,
                        email: usuario.email,
                        perfil: usuario.perfil
                    },

                    process.env.JWT_SECRET,
                    
                    {
                        expiresIn: '1h',
                        algorithms: 'HS256',
                        issuer: 'sys-pet-wallet',
                    }
                )

                res.cookie('token', token, {httpOnly: true, secure: true , maxAge:1000 * 60 * 60})
                res.render('index', {usuario: usuario.nome, title: 'Carteira de Pets',
                subtitle: 'Registre vacinas, banho, tosa e serviços para cães e gatos'})


            }catch(err){
                res.status(500).json({mensagem: 'Erro no servidor!'})
            }
        }


        export const logout = (req, res) => {
            // req.session.destroy((err) => {
            //     if(err) return res.status(500).json({mensagem: 'Erro no servidor!'})
            //         res.clearCookie('connect.sid')
            //     res.redirect('/login')
            // })
            res.clearCookie('token', 
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 1000 * 60 * 60
                } )

                return res.redirect('/login')

        }




     
export const recuperarSenha = (req, res) => {
    res.sendFile(path.resolve('./src/public/recuperarSenha.html'))
}


export const validarEmailRecuperacao = async (req, res) => {
    const { email } = req.body
    try {
        const usuario = await User.findOne({
            where: { email }
        })
        if (!usuario) {
            return res.status(400).send('Email não encontrado')
        }
        res.redirect(`/novaSenha.html?email=${email}`)
    } catch (err) {
        res.status(500).send('Erro no servidor')
    }
}

export const novaSenha = async (req, res) => {
    const { email, senha } = req.body
    try {
        const senhaCriptografada =
            await bcrypt.hash(senha, 10)
        await User.update(
            {
                senha: senhaCriptografada
            },
            {
                where: { email }
            }
        )
        res.send('Senha alterada com sucesso!')
    } catch (err) {
        res.status(500).send('Erro ao alterar senha')
    }
}