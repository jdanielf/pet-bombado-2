        import User from '../models/modelUser.js'
        import path from 'path'
        import bcrypt from 'bcrypt'
        import session from 'express-session'
        import jwt from 'jsonwebtoken'
        import dotenv from 'dotenv'
        dotenv.config()         
          
        const __dirname = path.resolve()



        export const login = (req, res) => {
            // Removido o redirecionamento automático para evitar loops infinitos se o token for inválido
            res.sendFile(path.join(__dirname, 'src', 'public', 'login.html'))
        }


        export const validarLogin = async (req, res) => {
            const{email, senha} = req.body
            if(!email || !senha) {
                return res.send(`
                    <script>
                        alert('Preencha todos os campos!');
                        window.location.href = '/login';
                    </script>
                `);
            }
               
            try{

                const usuario = await User.findOne({where: {email: email}})
                if(!usuario) {
                    return res.send(`
                        <script>
                            alert('Usuário não cadastrado!');
                            window.location.href = '/login';
                        </script>
                    `);
                }
                 
        
            const senhaDescript = await bcrypt.compare(senha, usuario.senha)
            if(!senhaDescript) {
                return res.send(`
                    <script>
                        alert('Senha Inválida!');
                        window.location.href = '/login';
                    </script>
                `);
            }

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

             
                const token =  jwt.sign(
                    {
                       id: usuario.idUser,
                        nome: usuario.nome,
                        email: usuario.email,
                        perfil: usuario.perfil
                    },

                    process.env.JWT_SECRET,
                    
                    {
                        expiresIn: '1h',
                        algorithm: 'HS256',
                        issuer: 'sys-pet-wallet',
                    }
                )
                    
                // REMOVIDO secure: true para funcionar em localhost
                res.cookie('token', token, { 
                    httpOnly: true, 
                    maxAge: 1000 * 60 * 60,
                    path: '/' 
                })
                
                res.redirect('/')

            }catch(err){
                console.error(err)
                res.status(500).json({mensagem: 'Erro no servidor!', erro: err.message})
            }
        }


        export const logout = (req, res) => {
            // Limpa o token e a sessão de forma limpa
            res.clearCookie('token', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            
            return res.redirect('/login');
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