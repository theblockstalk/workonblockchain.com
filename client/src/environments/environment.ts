// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  backend_url: 'http://localhost:4000/',
  frontend_url: 'http://localhost:4200/',
  google_client_id : '699068166900-r52plq8abcks3d2sanfisp6a4i8hoem2.apps.googleusercontent.com',
  linkedin_id: '860wydxdy7qqd2',
  linkedin_redirect_url : 'http://localhost:4200/linkedin-auth',
  google_redirect_url : 'http://localhost:4200/google-auth'
,
	baseHref: '/'
};

//console.log(environment);
