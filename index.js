//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48 




 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_key') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			if (text.includes('kaart')){ 
				sendTextMessage(sender, "Leuk dat je kaartjes wilt bestellen! ")
				//sendTextMessage(sender, "Hoeveel kaartje(s) wilt u bestellen? ")
				//sendButtonMessage(sender)
				sendGenericMessage(sender)
			}
			else if (text.includes("ticket")){
				sendTextMessage(sender, "Leuk dat je tickets wil bestellen
				//sendTextMessage(sender, "Hoeveel kaartje(s) wilt u bestellen? ")
				//sendButtonMessage(sender, text)
				sendGenericMessage(sender)
			}
			else if (text.includes("bewijs")){
				sendTextMessage(sender, "Leuk dat je kaartjes wil bestellen!")
				//sendTextMessage(sender, "Hoeveel kaartje(s) wilt u bestellen? ")
				//sendButtonMessage(sender, text)
				sendGenericMessage(sender)
			}
			else{
				sendTextMessage(sender, "Sorry, ik begrijp je niet helemaal, probeer eens: kaartje !")
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, text.substring(0, 200) + ", klik in de onderstaande link voor het betalen van je tickets", token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
var token = "EAAE5ZAU3E9SUBALxWNKu2xacOf2xUZBRuVbiynrcVElFXExu9EAcSg8o1zJYPE5whi7vpOP6H4OCw9WwRLiWrJ0ZAmnpTeP41c0yveg7riwk7k2cMs4Bjz6gEZBkiWeoNeaeVN2SZAXKOYdkiPxG9H985r4GyjwPNI5ZBakjNisgZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Regular Tickets",
					"subtitle": "Ga naar rechts voor de VIP Tickets",
					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",
					"buttons": [{
						"type": "postback",
						"title": "1 Regular",
						"payload": "1 Regular ticket"
					}, {
						"type": "postback",
						"title": "2 Regular",
						"payload": "2 Regular tickets",
					}],
				}, {
					"title": "Vip Tickets",
					"subtitle": "Ga naar links voor de Regular Tickets",
					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",
					"buttons": [{
						"type": "postback",
						"title": "1 VIP",
						"payload": "1 VIP Ticket",
					},	{
						"type": "postback",
						"title": "2 VIP",
						"payload": "2 VIP Tickets",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
/*
function sendButtonMessage(sender){
	let messagedata = {
		//"message":{
    "attachment":{
      "type":"template",
      "payload":{
			"template_type":"generic",
			"elements": [{
				"tiltle":"Wat voor tickets wil je?",
				"buttons":[{
						"type":"postback",
						"title":"Vip",
						"payload":"Leuk dat je Vip tickets wil bestellen ! Hoe veel wil je er bestellen?"
						},
						{
						"type":"postback",
						"title":"Regular",
						"payload":"Leuk dat je regular tickets wil bestellen! Hoe veel wil je er bestellen?"
						}
					]
				}
				]
			}
		}
	}
		request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
