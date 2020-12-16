/* SHARED MODULES USED IN EVERY PAGE
*
* In this file you can import JS or SCSS file wchich are shared on every page,
* basic configuration includes bootstrap-native-v4, and site.scss for entry point to sass loader
*
*/
import './polyfills';
import 'bootstrap.native/dist/bootstrap-native-v4';
import '../styles/site.scss';
import './custom/sidenav';
//import './custom/navbar';
import './custom/navbar-dropdown';
import 'font-awesome/scss/font-awesome.scss';
import './custom/recaptcha';

 