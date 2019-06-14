import {Component} from '@angular/core';
import {Router} from '@angular/router';

interface Cite {
    quote: string;
    author: string;
}

@Component({
    selector: 't-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

    private cite: number;

    private cites: Cite[] = [{
        quote: 'There’s never enough time to do all the nothing you want.',
        author: 'Bill Watterson'
    }, {
        quote: 'A man who dares to waste one hour of time has not discovered the value of life.',
        author: 'Charles Darwin'
    }, {
        quote: 'Time is what we want most, but what we use worst.',
        author: 'William Penn'
    }, {
        quote: 'It’s really clear that the most precious resource we all have is time.',
        author: 'Steve Jobs'
    }, {
        quote: 'The only reason for time is so that everything doesn’t happen at once.',
        author: 'Albert Einstein'
    }, {
        quote: 'Don’t spend time beating on a wall, hoping to transform it into a door.',
        author: 'Coco Chanel'
    }, {
        quote: 'In such seconds of decision entire futures are made.',
        author: 'Dan Simmons'
    }];

    constructor(private router: Router) {
        this.cite = Math.floor(Math.random() * this.cites.length);
    }

    get author(): string {
        return this.cites[this.cite].author;
    }

    get quote(): string {
        return this.cites[this.cite].quote;
    }

    go(): void {
        this.router.navigateByUrl('/dashboard');
    }
}
