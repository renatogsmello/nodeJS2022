const express = require("express")
const { randomUUID } = require("crypto")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.json())

let products = []

fs.readFile(path.join(__dirname, "products.json"), "utf-8", (err, data) => {
	if (err) {
		console.log(err)
	} else {
		products = JSON.parse(data)
	}
})

app.post("/products", (request, response) => {
	const { name, price } = request.body

	const product = {
		name: name,
		price: price,
		id: randomUUID(),
	}

	products.push(product)

	productFile()

	response.json(product)
})

app.get("/products", (request, response) => {
	return response.json(products)
})

app.get("/products/:id", (request, response) => {
	const { id } = request.params
	const product = products.find((product) => product.id === id)
	response.json(product)
})

app.put("/products/:id", (request, response) => {
	const { id } = request.params
	const { name, price } = request.body

	const productIndex = products.findIndex((product) => product.id === id)
	products[productIndex] = {
		...products[productIndex],
		name,
		price,
	}

	productFile()

	response.json({ message: "Produto alterado com sucesso" })
})

app.delete("/products/:id", (request, response) => {
	const { id } = request.params
	const productIndex = products.findIndex((product) => product.id === id)
	products.splice(productIndex, 1)

	productFile()

	response.json({ message: "Produto removido com sucesso" })
})

function productFile() {
	fs.writeFile(path.join(__dirname, "products.json"), JSON.stringify(products), (err) => {
		if (err) {
			console.log(err)
		} else {
			console.log("Produto cadastrado com sucesso")
		}
	})
}

app.listen(4002, () => console.log("Server rodando na porta 4002"))
