import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    )
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my web site');
  });

  describe("/music", () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get("/music")
        .expect(200)
        .expect([])
    })
    it('POST 201', () => {
      return request(app.getHttpServer())
        .post("/music")
        .send({
          title: "test song1",
          artists: ["artist1", "artist2"]
        })
        .expect(201)
    })
    it('POST 202', () => {
      return request(app.getHttpServer())
        .post('/music')
        .send({
          title: "test song1"
        })
        .expect(400)
    })
    it('POST 203', () => {
      return request(app.getHttpServer())
        .post('/music')
        .send({
          artists: ["artist1", "artist2"]
        })
        .expect(400)
    })
    it('SEARCH title 200', () => {
      return request(app.getHttpServer())
        .get("/music/search?searchingby=test&method=title")
        .expect(200)
        .expect([])
    })
    it('SEARCH artist 200', () => {
      return request(app.getHttpServer())
        .get("/music/search?searchingby=test&method=artist")
        .expect(200)
        .expect([])
    })
    it('SEARCH 405', () => {
      return request(app.getHttpServer())
        .get("/music/search?searchingby=test&method=genre")
        .expect(405)
    })
  })

  describe("/music/:id", () => {
    it("GET 200", () => {
      return request(app.getHttpServer())
        .get("/music/1")
        .expect(200)
    })
    it("GET 404", () => {
      return request(app.getHttpServer())
        .get("/music/999")
        .expect(404)
    })
    it("PATCH 200", () => {
      return request(app.getHttpServer())
        .patch("/music/1")
        .send({ title: "new title" })
        .expect(200)
    })
    it("PATCH 404", () => {
      return request(app.getHttpServer())
        .patch("/music/999")
        .send({ title: "new title" })
        .expect(404)
    })
    it("DELETE 200", () => {
      return request(app.getHttpServer())
        .delete("/music/1")
        .expect(200)
    })
    it("DELETE 404", () => {
      return request(app.getHttpServer())
        .delete("/music/999")
        .expect(404)
    })
  })
});
