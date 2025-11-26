import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { APP_CONFIG } from 'src/app/app.config';
import { environment } from "src/environments/environment";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
        providers: [
            { provide: APP_CONFIG, useValue: environment }
        ],
        }).compileComponents();
    });

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should have the 'atom-challenge-fe-template' title", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual("atom-challenge-fe-template");
    });
});
