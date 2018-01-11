'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./blogRouter');

app.use(morgan('common'));
app.use('/blog-posts', blogRouter);

app.listen(8080, () => {
	console.log(`Listening on port 8080`);
});
