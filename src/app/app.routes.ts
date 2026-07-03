import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Studentdetails } from './studentdetails/studentdetails';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'studentdetails', component: Studentdetails }
];





