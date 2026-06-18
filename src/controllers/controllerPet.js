import Pet from '../models/modelPet.js'

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

const buildVaccines = (body) => {
  const names = normalizeArray(body.vaccineName)
  const appliedDates = normalizeArray(body.vaccineAppliedDate)
  const nextDates = normalizeArray(body.vaccineNextDate)
  const vaccines = []

  for (let i = 0; i < names.length; i += 1) {
    if (!names[i] && !appliedDates[i] && !nextDates[i]) continue
    vaccines.push({
      name: names[i] || '',
      appliedDate: appliedDates[i] || '',
      nextDate: nextDates[i] || ''
    })
  }

  return vaccines
}

const listPets = async (req, res) => {
  const pets = await Pet.findAll({ order: [['name', 'ASC']] })
  res.render('pets', { title: 'Lista de Pets', pets })
}

const showNewPetForm = (req, res) => {
  res.render('petForm', {
    title: 'Cadastrar Pet',
    pet: null,
    action: '/pets',
    method: 'POST',
    perfil: req.usuario.perfil
  })
}

const createPet = async (req, res) => {
  const vaccines = buildVaccines(req.body)

  let ownerName = null
  let ownerAddress = null
  let ownerPhone = null

  if (req.usuario.perfil === 'petshop') {
    ownerName = req.body.ownerName
    ownerAddress = req.body.ownerAddress
    ownerPhone = req.body.ownerPhone
  }

  await Pet.create({
    name: req.body.name,
    species: req.body.species,
    breed: req.body.breed,
    gender: req.body.gender,
    birthDate: req.body.birthDate || null,

    ownerName,
    ownerAddress,
    ownerPhone,

    vaccines,
    nextVaccineAlertDays: Number(req.body.nextVaccineAlertDays) || 7,
    bathDate: req.body.bathDate || null,
    groomingDate: req.body.groomingDate || null,
    serviceLocation: req.body.serviceLocation,
    serviceContact: req.body.serviceContact,
    serviceDeparture: req.body.serviceDeparture,
    serviceReturn: req.body.serviceReturn,
    notes: req.body.notes
  })

  res.redirect('/pets')
}

const viewPetDetails = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id)
  if (!pet) return res.status(404).render('error', { title: 'Pet não encontrado', message: 'Pet não localizado.' })
  res.render('petDetails', { title: `Detalhes de ${pet.name}`, pet })
}

const showEditPetForm = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id)

  if (!pet) {
    return res.status(404).render('error', {
      title: 'Pet não encontrado',
      message: 'Pet não localizado.'
    })
  }

  res.render('petForm', {
    title: `Editar ${pet.name}`,
    pet,
    action: `/pets/${pet.id}`,
    method: 'POST',
    perfil: req.usuario.perfil
  })
}

const updatePet = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id)
  if (!pet) return res.status(404).render('error', { title: 'Pet não encontrado', message: 'Pet não localizado.' })

  const vaccines = buildVaccines(req.body)
  await pet.update({
    name: req.body.name,
    species: req.body.species,
    breed: req.body.breed,
    gender: req.body.gender,
    birthDate: req.body.birthDate || null,
    ownerName: req.body.ownerName,
    ownerAddress: req.body.ownerAddress,
    ownerPhone: req.body.ownerPhone,
    vaccines,
    nextVaccineAlertDays: Number(req.body.nextVaccineAlertDays) || 7,
    bathDate: req.body.bathDate || null,
    groomingDate: req.body.groomingDate || null,
    serviceLocation: req.body.serviceLocation,
    serviceContact: req.body.serviceContact,
    serviceDeparture: req.body.serviceDeparture,
    serviceReturn: req.body.serviceReturn,
    notes: req.body.notes
  })
  res.redirect('/pets')
}

const deletePet = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id)
  if (pet) await pet.destroy()
  res.redirect('/pets')
}

export {
  listPets,
  showNewPetForm,
  createPet,
  viewPetDetails,
  showEditPetForm,
  updatePet,
  deletePet
}
