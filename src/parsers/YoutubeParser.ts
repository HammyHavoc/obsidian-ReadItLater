import { ReadItLaterSettings } from '../settings';
import { request } from 'obsidian';
import { Note } from './Note';
import { Parser } from './Parser';

class YoutubeParser extends Parser {
    private PATTERN = /(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;

    constructor(settings: ReadItLaterSettings) {
        super(settings);
    }

    test(url: string): boolean {
        return this.isValidUrl(url) && this.PATTERN.test(url);
    }

    async prepareNote(url: string): Promise<Note> {
        const response = await request({ method: 'GET', url });
        const videoTitle = new DOMParser().parseFromString(response, 'text/html').title;
        const videoId = this.PATTERN.exec(url)[4];
        const videoPlayer = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

        const content = this.settings.youtubeNote
            .replace('%videoTitle%', videoTitle)
            .replace('%videoURL%', url)
            .replace('%videoId%', videoId)
            .replace('%videoPlayer%', videoPlayer);

        const fileName = `Youtube - ${videoTitle}.md`;
        return new Note(fileName, content);
    }
}

export default YoutubeParser;
