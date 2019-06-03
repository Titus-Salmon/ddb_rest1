import { Component, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    showNoteModal = false;
    selectedNote;

    constructor() {}

    ngOnInit() {
        this.selectedNote = {};
    }

    onShowNoteModal($event) {
        this.showNoteModal = true;
    }

    onCloseNoteModal($event) {
        this.showNoteModal = false;
    }

}