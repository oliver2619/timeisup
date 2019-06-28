import {Component} from '@angular/core';
import {version} from '../../../package.json';

@Component({
    selector: 't-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent  {

    get version(): string {return version;}

    constructor() {}
}
