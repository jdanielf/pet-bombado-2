import sequelize from './database.js'
import Pet from '../models/modelPet.js'
import User from '../models/modelUser.js'

const sincronizarDB = async () => {
  try {
    await sequelize.authenticate()
    await Pet.sync()
    await User.sync({force :false})
    console.log('Banco de dados sincronizado com sucesso')
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error)
  }
}

export { sequelize, sincronizarDB }
