import { Component, OnInit } from '@angular/core';

@Component({
  selector: 't-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    onSelect(state: boolean): void {
        console.log(state);
    }
}
