import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: [
        `.title {
            color: whitesmoke;
            font-size: 25px;
            font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            letter-spacing: 0.5em;
            position: relative;
            top: 2px;
}`

    ]
})
export class HeaderComponent {
    searchToggleStatus: boolean;
    projectName:string;

    constructor(public settings: SettingsService) {
        this.projectName = this.settings.app.name;
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        this.searchToggleStatus = !this.searchToggleStatus;
    }

}
