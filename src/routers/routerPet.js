import express from 'express'
import {autenticar} from '../middlewares/auth.js'
import {
  listPets,
  showNewPetForm,
  createPet,
  viewPetDetails,
  showEditPetForm,
  updatePet,
  deletePet
} from '../controllers/controllerPet.js'

const router = express.Router()

router.get('/pets', autenticar, listPets)
router.get('/pets/new', autenticar, showNewPetForm)
router.post('/pets', autenticar, createPet)
router.get('/pets/:id', autenticar, viewPetDetails)
router.get('/pets/:id/edit', autenticar, showEditPetForm)
router.post('/pets/:id', autenticar, updatePet)
router.post('/pets/:id/delete', autenticar, deletePet)


export default router
