import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 't-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

    @Input()
    value: string;

    @Output()
    close: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {
    }

    closeIt(): void {
        this.close.emit();
    }

}
