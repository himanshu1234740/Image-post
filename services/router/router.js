const express = require('express');
const router = express.Router()
const controller = require('../controller/controll')
const multer = require('multer');
const axios = require('axios')
const auth = require('../middelware/auth')
const swal = require('sweetalert');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)

  }
})

const upload = multer({ storage: storage })

router.get('/', function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    res.render('index', { users: response.data })
  }).catch(function (err) {
    console.log(err)
  })

})
router.get('/update', (req, res) => {

  axios.get('http://localhost:3000/api/users/', { params: { id: req.query.id } }).then(function (response) {

    res.render('update', { users: response.data })
  }).catch((err) => {
    console.log(err)
  })
})

router.get('/Detail', (req, res) => {
  axios.get('http://localhost:3000/api/users', { params: { id: req.query.id } }).then((response) => {
    res.render('detail', { detail: response.data })
  }).catch((err) => {
    console.log(err)
  })
})

//authantication page routes
router.get('/register', (req, res) => {
  res.render('register')
})
router.get('/login', (req, res) => {

  res.render('login')

})
router.get('/post', auth, (req, res) => {
  if (req.status === 500) {
    res.render('unauthorizedAccess')
    res.status(500).render('post')

  } else {
    axios.get('http://localhost:3000/api/users').then(function (response) {
      res.render('post', { users: response.data.filter((post) => post.id == req.user._id),name: req.user })
    }).catch(function (err) {
      console.log(err)
    })

  }

})
router.get('/logout', auth, async (req, res) => {
  try {

    res.clearCookie('jwt')
    console.log('logout completed')

    res.redirect('/login')
  } catch (error) {
    console.log(error)
  }

})
router.get('/addpost', auth, (req, res) => {
  if (req.status === 500) {
    res.render('unauthorizedAccess')
    res.status(500).render('addpost')

  } else {
    res.status(200).render('addpost')

  }
})
router.get('/profile', auth, (req, res) => {
  if (req.status === 500) {
    res.render('unauthorizedAccess')
    res.status(500).render('profile')

  } else {
      res.render('profile',{login_user: req.user})


  }
})
router.get('/forget', (req, res)=>{
  // axios.get('http://localhost:3000/api/forget').then(()=>{
  //   res.send(data);
  // })
  res.render('forget')
})
router.get('/password', (req, res)=>{
  res.render('password')
})

//api path
router.get('/api/users', controller.read)
router.post('/api/users', upload.single('img'), controller.create);
router.delete('/api/users/:id', controller.delete)
router.put('/api/users/:id', upload.single('img'), controller.update)

//api for register 
router.post('/api/register', controller.post)
router.post('/api/login', controller.readuser)
router.get('/api/login', controller.profile)
router.put('/api/login/:id', controller.profileUpdate)
router.post('/api/forget', controller.getRegistrUser)
router.put('/api/forget/:id', controller.forget)


module.exports = router