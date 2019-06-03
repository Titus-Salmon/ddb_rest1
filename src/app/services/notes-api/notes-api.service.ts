import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotesApiService {

    constructor(private httpClient: HttpClient) {

    }

    addNote(item) {
        let endpoint = process.env.API_ROOT + '/api/note';
        let itemData;
        itemData = {
            content: item.content,
            cat: item.cat
        };

        if(item.title != "") {
            itemData.title = item.title;
        }

        let reqBody = {
            Item: itemData
        };

        return this.httpClient.post(endpoint, reqBody);
    }

    updateNote(item) {
        let endpoint = process.env.API_ROOT + '/api/note';
        let itemData;
        itemData = {
            content: item.content,
            cat: item.cat,
            timestamp: parseInt(item.timestamp),
            note_id: item.note_id
        };

        if (item.title != "") {
            itemData.title = item.title;
        }

        let reqBody = {
            Item: itemData
        };

        return this.httpClient.patch(endpoint, reqBody);
    }

    deleteNote(timestamp) {
        let endpoint = process.env.API_ROOT + '/api/note/' + timestamp;
        return this.httpClient.delete(endpoint);
    }

    getNotes(start?): Observable<any> {
        let endpoint = process.env.API_ROOT + '/api/notes?limit=5';
        if (start > 0) {
            endpoint += '&start=' + start;
        }
        return this.httpClient.get(endpoint);
    }

}