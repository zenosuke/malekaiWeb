import { NgModule } from '@angular/core';

import { SafeStylePipe } from './safe-style.pipe';

@NgModule({
  declarations: [
    SafeStylePipe
  ],
  exports: [
    SafeStylePipe
  ]
})
export class PipesModule { }
