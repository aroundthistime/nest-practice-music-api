import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { CreateMusicDto } from './DTO/create-music.dto';
import { UpdateMusicDto } from './DTO/update-music.dto';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {
    private musics: Music[] = [];

    getMusics(): Music[] {
        return this.musics;
    }

    getMusic(musicId: number): Music {
        const music = this.musics.find(music => music.id === musicId);
        if (!music) {
            throw new NotFoundException(`Music with the ID ${musicId} doesn't exist`)
        }
        return music;
    }

    searchMusic(keyword: string, method: string): Music[] {
        let musics: Music[];
        if (method === "title") {
            musics = this.musics.filter(music => music.title === keyword);
        } else if (method === "artist") {
            musics = this.musics.filter(music => music.artists.indexOf(keyword) > -1);
        } else {
            throw new MethodNotAllowedException("You must search with the title or the artist");
        }
        return musics;
    }

    createMusic(musicData: CreateMusicDto) {
        this.musics.push({
            id: this.musics.length + 1,
            ...musicData
        })
    }

    updateMusic(musicId: number, musicData: UpdateMusicDto) {
        const music = this.getMusic(musicId);
        this.deleteMusic(musicId);
        this.musics.push({
            ...music,
            ...musicData
        })
    }

    deleteMusic(musicId: number) {
        this.getMusic(musicId);
        this.musics = this.musics.filter(music => music.id !== musicId);
    }
}
