import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateMusicDto } from './DTO/create-music.dto';
import { UpdateMusicDto } from './DTO/update-music.dto';
import { Music } from './entities/music.entity';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) { }

    @Get()
    getMusics(): Music[] {
        return this.musicService.getMusics();
    }

    @Get("/search")
    searchMusic(@Query("searchingBy") keyword: string, @Query("method") method: string): Music[] {
        return this.musicService.searchMusic(keyword, method);
    }

    @Get("/:id")
    getMusic(@Param("id") musicId: number): Music {
        return this.musicService.getMusic(musicId);
    }

    @Post()
    createMusic(@Body() musicData: CreateMusicDto) {
        return this.musicService.createMusic(musicData);
    }

    @Patch("/:id")
    updateMusic(@Param("id") musicId: number, @Body() musicData: UpdateMusicDto) {
        return this.musicService.updateMusic(musicId, musicData);
    }

    @Delete("/:id")
    deleteMusic(@Param("id") musicId: number) {
        return this.musicService.deleteMusic(musicId);
    }
}