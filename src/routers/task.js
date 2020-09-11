const express = require('express')
const router = new express.Router()

const Task = require('../models/task')
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        const saved =await task.save()
        res.send(saved)
    }catch(e){
        res.status(500).send()
    }
})

//GET /tasks?completed=true
//GeT /tasks?limit=10&skip=

router.get('/tasks', auth, async (req,res)=>{
    try{
        const match = {}
        match.owner = req.user._id


        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        const limit = parseInt(req.query.limit) || 10
        const skipnum = parseInt(req.query.skip) || 0
        const sort = {}
        if (req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        console.log(sort)
        const tasks = await Task.find(match).limit(limit).skip(skipnum * limit).sort(sort)
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id

    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id , owner: req.user._id })
        if (!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowed = ['desc','completed']
    const isvalid = updates.every((update)=>allowed.includes(update))

    if (!isvalid){
        return res.status(400).send({error: 'invalid updates'})
    }

    try{
        const task = await Task.findOne({_id : req.params.id, owner: req.user._id})
        // const task =await Task.findById(req.params.id)

        // const task = await Task.findByIdAndUpdate(req.params.id,req.body, {new : true, runValidators: true})
        if (!task){
            res.status(400).send({error : 'task not found'})
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id , owner : req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id)
        if (!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

})

module.exports = router