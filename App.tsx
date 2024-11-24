import { registerRootComponent } from 'expo';
import App from './app/';

// registerRootComponent 確保應用無論是在開發環境還是生產環境都能正確啟動
registerRootComponent(App);