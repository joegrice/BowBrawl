import { Events } from "../../shared/Events";
import GameEvents = Events.GameEvents;

declare const window: any;

export class Login {
    private _formContainer: HTMLDivElement;
    private _loginPage: HTMLDivElement;
    private _form: HTMLDivElement;
    private _loginForm: HTMLFormElement;
    private _input: HTMLInputElement;
    private _button: HTMLButtonElement;
    private _winnerText: HTMLParagraphElement;
    private _name: any;

    constructor(winner?: string) {
        this.createForm(winner);
    }

    private createForm(winner?: string): void {
        this._formContainer = document.createElement("div");
        this._formContainer.className = "form-container";

        this._loginPage = document.createElement("div");
        this._loginPage.className = "login-page";

        this._form = document.createElement("div");
        this._form.className = "_form";

        this._loginForm = document.createElement("form");

        this._input = document.createElement("input");
        this._input.setAttribute("type", "text");
        this._input.placeholder = "username";
        this._input.maxLength = 6;
        this._input.id = "your-name";
        this._input.focus();

        this._button = document.createElement("button");
        this._button.innerText = "Join game";
        this._button.addEventListener("click", (e) => this.createPlayer(e));

        this._loginForm.appendChild(this._input);
        this._loginForm.appendChild(this._button);
        this._loginPage.appendChild(this._form);
        this._form.appendChild(this._loginForm);
        this._formContainer.appendChild(this._loginPage);

        if (winner) {
            this._winnerText = document.createElement("p");
            this._winnerText.innerText = `WINNER OF LAST ROUND WAS ${winner}`;
            this._formContainer.appendChild(this._winnerText);
        }

        document.body.appendChild(this._formContainer);
    }

    private createPlayer(e: MouseEvent): void {
        e.preventDefault();
        this._formContainer.classList.toggle("visible");
        const name = this._input.value;
        window.socket.emit(GameEvents.authentication, {name}, {
            x: window.innerWidth,
            y: window.innerHeight
        });
    }


    get formContainer(): HTMLDivElement {
        return this._formContainer;
    }

    set formContainer(value: HTMLDivElement) {
        this._formContainer = value;
    }

    get loginPage(): HTMLDivElement {
        return this._loginPage;
    }

    set loginPage(value: HTMLDivElement) {
        this._loginPage = value;
    }

    get form(): HTMLDivElement {
        return this._form;
    }

    set form(value: HTMLDivElement) {
        this._form = value;
    }

    get loginForm(): HTMLFormElement {
        return this._loginForm;
    }

    set loginForm(value: HTMLFormElement) {
        this._loginForm = value;
    }

    get input(): HTMLInputElement {
        return this._input;
    }

    set input(value: HTMLInputElement) {
        this._input = value;
    }

    get button(): HTMLButtonElement {
        return this._button;
    }

    set button(value: HTMLButtonElement) {
        this._button = value;
    }

    get name(): any {
        return this._name;
    }

    set name(value: any) {
        this._name = value;
    }
}