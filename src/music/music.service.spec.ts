import { MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MusicService } from './music.service';

describe('MusicService', () => {
  let service: MusicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicService],
    }).compile();

    service = module.get<MusicService>(MusicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getMusics", () => {
    it("should return an array", () => {
      const musics = service.getMusics();
      expect(musics).toBeInstanceOf(Array);
    })
  })

  describe("getMusic", () => {
    it("should return a music", () => {
      service.createMusic({
        title: "Test song1",
        artists: ["artist1", "artist2"]
      });
      const music = service.getMusic(1);
      expect(music).toBeDefined();
      expect(music.id).toEqual(1);
      expect(music.title).toEqual("Test song1");
      expect(music.artists).toContain("artist1");
      expect(music.artists).toContain("artist2");
    })
    it("should throw 404 error", () => {
      try {
        service.getMusic(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual("Music with the ID 999 doesn't exist");
      }
    })

    describe("searchMusic", () => {
      beforeEach(() => {
        service.createMusic({
          title: "Test song1",
          artists: ["artist1", "artist2"]
        });
      })
      it("should return an array using title", () => {
        const musics = service.searchMusic("Test song1", "title");
        expect(musics.length).toEqual(1);
        expect(musics[0].title).toEqual("Test song1");
        expect(musics[0].artists).toContain("artist1");
        expect(musics[0].artists).toContain("artist2");
      })
      it("should return an array using artist", () => {
        const musics = service.searchMusic("artist1", "artist");
        expect(musics.length).toEqual(1);
        expect(musics[0].title).toEqual("Test song1");
        expect(musics[0].artists).toContain("artist1");
        expect(musics[0].artists).toContain("artist2");
      })
      it("should throw MethodNotAllowedException when not using proper search method", () => {
        try {
          service.searchMusic("artist1", "genre");
        } catch (error) {
          expect(error).toBeInstanceOf(MethodNotAllowedException);
          expect(error.message).toEqual("You must search with the title or the artist");
        }
      })
      it("should return an empty array", () => {
        const musics = service.searchMusic("Test song2", "title");
        expect(musics.length).toEqual(0);
      })
    })

    describe("createMusic", () => {
      it("should create a music", () => {
        const beforeCreateCount = service.getMusics().length;
        service.createMusic({
          title: "Test song1",
          artists: ["artist1", "artist2"]
        })
        const afterCreateCount = service.getMusics().length;
        const newMusic = service.getMusic(1);
        expect(afterCreateCount).toBeGreaterThan(beforeCreateCount);
        expect(newMusic.title).toEqual("Test song1");
        expect(newMusic.artists).toContain("artist1");
        expect(newMusic.artists).toContain("artist2");
      })
    })

    describe("updateMusic", () => {
      beforeEach(() => {
        service.createMusic({
          title: "Test song1",
          artists: ["artist1", "artist2"]
        })
      })
      it("should update a music", () => {
        const beforeUpdateMusicCount = service.getMusics().length;
        const musicBeforeUpdate = service.getMusic(1);
        service.updateMusic(1, {
          title: "Test song2"
        });
        const afterUpdateMusicCount = service.getMusics().length;
        const musicAfterUpdate = service.getMusic(1);
        expect(beforeUpdateMusicCount).toEqual(afterUpdateMusicCount);
        expect(musicAfterUpdate.title).toEqual("Test song2");
        musicBeforeUpdate.artists.forEach(artist => {
          expect(musicAfterUpdate.artists).toContain(artist)
        })
      })
      it("should return a NotFoundException", () => {
        try {
          service.updateMusic(2, {});
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      })
    })

    describe("deleteMusic", () => {
      beforeEach(() => {
        service.createMusic({
          title: "Test song1",
          artists: ["artist1", "artist2"]
        })
      });
      it("should delete a movie", () => {
        let isDeleted = false;
        const beforeDeleteMusicCount = service.getMusics().length;
        service.deleteMusic(1);
        const afterDeleteMusicCount = service.getMusics().length;
        try {
          console.log(service.getMusic(1));
        } catch (error) {
          if (error.message === "Music with the ID 1 doesn't exist") {
            isDeleted = true;
          }
        }
        expect(afterDeleteMusicCount).toBeLessThan(beforeDeleteMusicCount);
        expect(isDeleted).toEqual(true);
      })
      it("should return a NotFoundException", () => {
        try {
          service.deleteMusic(999);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      })
    })
  })
});
