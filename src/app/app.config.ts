import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideNzIcons } from './icons-provider';
import { ReloadOutline } from '@ant-design/icons-angular/icons';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzIconService } from 'ng-zorro-antd/icon';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideNzI18n(es_ES), 
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(),
    {
      provide: 'initializeIcons',
      useFactory: (iconService: NzIconService) => {
        iconService.addIcon(ReloadOutline);
      },
      deps: [NzIconService],
    }, provideNzIcons(), provideNzI18n(es_ES), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(),
  ]
};
