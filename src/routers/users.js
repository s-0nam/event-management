const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/Auth')
const router = new express.Router() 
const multer = require('multer')

router.post('/users' , async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken() 
        res.send({ user, token }) 
    } catch(e) {
        res.status(404).send(e)
    }
})

router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/login', async (req, res) => {
    try { 
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() 
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValid = updates.every((u) => allowedUpdates.includes(u))

    if (!isValid) {
        return res.status(400).send( {error: 'invalid update'} )
    }
    try { 
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save() 
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    dest: 'avatar'
})

router.post('/users/me/avatar', upload.single('avatar') , async (req, res) => {
    res.send()
})

module.exports = router