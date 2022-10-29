const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
let server;
let token, name;

describe('auth middleware', () => {
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name})
    }

    beforeEach(() =>{
        server = require('../../../index');
        token = new User().generateAuthToken();
        name = new Array(6).join('a');
    })

    afterEach(async () => {
        await Genre.deleteMany({});
        server.close();
    })

    it("should return 401 if no token is provided", async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401)
    })

    it("should return 400 if token is invalid", async () => {
        token = 'abc';
        const res = await exec();
        expect(res.status).toBe(400)
    })

    it("should return 200 if token is valid", async () => {
        const res = await exec();
        expect(res.status).toBe(200)
    })
})