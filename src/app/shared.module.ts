import { NgModule } from '@angular/core';
import { CopyDirective,NumberDirective,CharacterDirective} from './Directives/copydirective'
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [  
    CopyDirective,
    NumberDirective,
    CharacterDirective
  ],
   exports: [
   CopyDirective,
   NumberDirective,
   CharacterDirective   
  ],
})
export class SharedModule {}

