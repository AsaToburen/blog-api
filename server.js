'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

const blogRouter = require('./blogRouter');

app.use(morgan('common'));
app.use('/blog-posts', blogRouter);

// server declared using let, since runServer and closeServer functions
// assign to the same object

let server;

function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app
			.listen(port, () => {
				console.log(`Your app is listening on post ${port}`);
				resolve(server);
			})
			.on('error', err => {
				reject(err);
			});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };
