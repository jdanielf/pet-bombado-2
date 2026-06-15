import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.STRING
  },
  birthDate: {
    type: DataTypes.DATEONLY
  },
  ownerName: {
    type: DataTypes.STRING
  },
  ownerAddress: {
    type: DataTypes.STRING
  },
  ownerPhone: {
    type: DataTypes.STRING
  },
  vaccines: {
    type: DataTypes.TEXT,
    get() {
      const raw = this.getDataValue('vaccines')
      return raw ? JSON.parse(raw) : []
    },
    set(value) {
      this.setDataValue('vaccines', JSON.stringify(value || []))
    }
  },
  nextVaccineAlertDays: {
    type: DataTypes.INTEGER,
    defaultValue: 7
  },
  bathDate: {
    type: DataTypes.DATEONLY
  },
  groomingDate: {
    type: DataTypes.DATEONLY
  },
  serviceLocation: {
    type: DataTypes.STRING
  },
  serviceContact: {
    type: DataTypes.STRING
  },
  serviceDeparture: {
    type: DataTypes.STRING
  },
  serviceReturn: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
})

export default Pet
