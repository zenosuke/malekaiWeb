import { Component } from '@angular/core';
import { MalekaiService } from './services';

@Component({
  selector: 'malekai-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'malekai works!';

  constructor(private malekaiService: MalekaiService) { }

  ngOnInit() {
    this.malekaiService.init();
  }
}
