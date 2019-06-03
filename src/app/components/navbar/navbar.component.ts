import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    @Output() showNoteModalEvent = new EventEmitter();
    constructor() { }

    ngOnInit() { }

    onShowNoteModal($event) {
        $event.preventDefault();
        this.showNoteModalEvent.emit();
    }
}