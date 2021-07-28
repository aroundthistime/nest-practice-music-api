import { IsString } from "class-validator";

export class CreateMusicDto {
    @IsString()
    readonly title: string;

    @IsString({ each: true })
    readonly artists: string[];
}