import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthCallbackComponent} from './auth-callback/auth-callback.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth_callback', component: AuthCallbackComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
