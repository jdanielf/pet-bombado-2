import express from 'express'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import routerPet from './src/routers/routerPet.js'
import { sincronizarDB } from './src/config/orm.js'
import routerUser from './src/routers/rotaUser.js'
import routerLogin from './src/routers/routerLogin.js'
import session from 'express-session'
import connectSqlite from 'connect-sqlite3'
import { apagarCache } from './src/middlewares/auth.js'
import cookieParser from 'cookie-parser'


const SQLiteStore = connectSqlite(session)


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

let PORT = process.env.EXPRESS_PORT 
let HOST = process.env.EXPRESS_HOST 

if(process.env.MODE_NODE === 'dev') {
  PORT = 3000
  HOST = 'localhost'
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'src/public')))
app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

app.use(session({

  store: new SQLiteStore({
    db: 'sessoes.db',
    dir: './src/database',
    table: 'sessions',
    ttl:60 *60 * 24
  }),


   
  
  secret: 'sistema_pet',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie:{maxAge: 1000 * 60 * 60,
    // expires: new Date(Date.now() + 1000 * 60 * 60) tempo fixo,
    httpOnly: true
}
})
)
app.use(cookieParser())
app.use(apagarCache)

app.use(routerPet)
app.use(routerUser)
app.use(routerLogin)



app.get('/', (req, res) => {
res.redirect('/login')


  // res.render('index', {
  //   usuario: 'visitante',
  //   title: 'Carteira de Pets',
  //   subtitle: 'Registre vacinas, banho, tosa e serviços para cães e gatos'
  // })
})

await sincronizarDB()

app.listen(PORT, HOST, () => {
  console.log(`Servidor em execução em http://${HOST}:${PORT}`)
})
