import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { ManagerDetails } from './manager-details/manager-details';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ManagerDashboard } from './manager-dashboard/manager-dashboard';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { Studentdetails } from './studentdetails/studentdetails';
import { AboutUs } from './about-us/about-us';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'studentdetails', component: Studentdetails },
  { path: 'manager-details', component: ManagerDetails },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'manager-dashboard', component: ManagerDashboard },
  { path: 'about-ui', component: AboutUs }
];
   





