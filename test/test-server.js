const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Blog Posts', function() {
	it('GET should return a list of blog posts', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
			});
	});

	it('POST should add a post', function() {
		const newPost = {
			title: 'New Title',
			content: 'Test Content',
			author: 'Test author',
			publishDate: Date.now()
		};
		return chai
			.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(newPost, { id: res.body.id }));
			});
	});

	it('PUT should update a post', function() {
		const updatedPost = {
			title: 'This new title',
			content: 'This new test content',
			author: 'This new author',
			publishDate: Date.now()
		};

		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				updatedPost.id = res.body[0].id;
				return chai
					.request(app)
					.put(`/blog-posts/${updatedPost.id}`)
					.send(updatedPost);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
				expect(res.body).to.be.a('object');
			});
	});

	it('should delete items on DELETE', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});
});
