import express from 'express'
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

router.get('/pets', listPets)
router.get('/pets/new', showNewPetForm)
router.post('/pets', createPet)
router.get('/pets/:id', viewPetDetails)
router.get('/pets/:id/edit', showEditPetForm)
router.post('/pets/:id', updatePet)
router.post('/pets/:id/delete', deletePet)

export default router
