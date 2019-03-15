// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  backend_url: 'http://localhost:4000/',
  frontend_url: 'http://localhost:4200/',
  google_client_id : '135955856742-6v8g64ojni6qah7ej8osp0ugsu8buop8.apps.googleusercontent.com',
  linkedin_id: '78lfupn2m88e4u',
  linkedin_redirect_url : 'http://localhost:4200/linkedin-auth',
  google_redirect_url : 'http://localhost:4200/google-auth'

};

//console.log(environment);
