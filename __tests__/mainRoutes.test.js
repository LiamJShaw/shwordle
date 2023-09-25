const supertest = require('supertest');
const app = require('../app');

let server;
beforeAll(() => {
  server = app.listen(); // or however you start your server
});

afterAll(done => {
  server.close(done); // close the server after all tests have run
});


describe('Testing routes', () => {
    
    test('GET / should return status 200 and render index', async () => {
        const response = await supertest(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('SHWORDLE |'); // Check if response renders the correct view
        // You can add more assertions here
    });

    test('GET /play should return status 200', async () => {
        const response = await supertest(app).get('/play');
        
        expect(response.statusCode).toBe(200);
    });
    
    test('GET /random should return status 200', async () => {
        const response = await supertest(app).get('/random');
        
        expect(response.statusCode).toBe(200);
    });

    test('GET / should handle rendering error gracefully', async () => {
        // Mock a rendering error
        app.set('view engine', 'ejs');
        
        const response = await supertest(app).get('/');
        
        expect(response.statusCode).toBe(500); // Expecting internal server error
        // reset the view engine after the test
        app.set('view engine', 'jade');
    });
    
    test('GET /nonexistentroute should return status 404', async () => {
        const response = await supertest(app).get('/nonexistentroute');
        
        expect(response.statusCode).toBe(404);
    });
    

});
