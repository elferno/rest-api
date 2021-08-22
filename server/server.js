// imports
import express from 'express'
import config from 'config'
import path from 'path'
import {v4} from 'uuid'
import { fileURLToPath } from 'url'

// var
const server = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// db data
let CONTACTS = [
	{id: 1, name: 'Elijah', value: 'noob', marked: false}
];

// prefs
const SERVER = {
	port: config.get('Server.port')
}
const CLIENT = {
	basedir: path.resolve(__dirname, `../${config.get('Client.basedir')}`)
}
const REST = {
	contacts: config.get('REST.contacts')
}

// server prefs
server.use(express.json());
server.use(express.static(CLIENT.basedir));

// REST endpoints
server.get(REST.contacts, (req, res) => {
	setTimeout(() => res.json(CONTACTS), 1000)
})

server.post(REST.contacts, (req, res) => {
	const contact = {id: v4(), ...req.body, marked: false}
	CONTACTS.push(contact)
	setTimeout(() => res.status(201).json(contact), 1000)
})

server.delete(`${REST.contacts}/:id`, (req, res) => {
	CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
	setTimeout(() => res.json({message: `contact deleted`}), 1000)
})

server.put(`${REST.contacts}/:id`, (req, res) => {
	const index = CONTACTS.findIndex(c => c.id === req.params.id)
	CONTACTS[index] = req.body
	setTimeout(() => res.json(CONTACTS[index]), 1000)
})

// routers handle
server.get('*', (req, res) => {
	res.sendFile(path.join(CLIENT.basedir, 'index.html'))
})

// start server
server.listen(SERVER.port, () => console.log(`server rised on port ${SERVER.port} ...`))