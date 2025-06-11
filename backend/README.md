<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Tips for creating SPA Api (laravel 12)

This app will have a laravel backend for supplying an api and a separate agnostic frontend. The authentication will be xsrf and session cookie based for the frontend to consume the api.

## setup up a new project with breeze, mysql and pest

By installing a new project with breeze and mysql a lot is pre configured and ready to use

-   create an api with laravel and give the user model the ability to store token

```bash
laravel new sanctum-cookie
```

```bash
php artisan install:api
```

Find api.php file in the routes folder. Here are the routes for the api configured. The routes are prefixed with /api. Get rid of the pre-shipped protected user route that is sanctum protected and us a simple get user route to check if the /api/test route works.

```php api.php
// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/test', function (Request $request) {
    return ['test' => 'test'];
});
```

The routes are already provide in bootstrap/app.php the api.

```php app.php
->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: [__DIR__ . '/../routes/api.php'],
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
)
```

So you only have to add the sanctum provider for stateful usage (session and csrf cookies)

```php app.php
->withMiddleware(function (Middleware $middleware) {
    // other sanctum providers
    $middleware->statefulApi();
    // other sanctum providers
})

```

## stateful applications (in laravel) with session cookies and csrf cookies

### State Management

Stateful:
Maintains state across multiple requests. This is typically done using sessions or server-side storage.

Stateless:
No state is retained between requests. Each request must contain all information needed for processing.

### Scalability

Stateful:
Scaling requires session data to be shared or replicated across servers, which can be complex.

Stateless:
Easily scaled by adding more servers, as no session data needs to be synchronized.

### Complexity

Stateful:
Requires session management logic, adding complexity to the application.

Stateless:
Simpler design but may require more complex client logic to include all necessary information in each request.

## Complex overall setup configuration in sanctum, laravel, react and postman

The configuration for session and csrf based on cookies needs to be done for sanctum, laravel and and the frontend app. We will tackle it here for sanctum and laravel.

## setup laravel with sanctum provider

Preset:
In order to authenticate, your SPA and API must share the same top-level domain. However, they may be placed on different subdomains.
Additionally, you should ensure that you send the Accept: application/json header and either the Referer or Origin header with your request.

Bootstrap a sanctum provider service statefulApi to the bootstrap/app.php to make it available to laravel. statefulApi has to be configured in sanctum.php.

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
    // ...
})
```

## setup config/sanctum.php

In config/sanctum.php we declare the stateful domains with SANCTUM_STATEFUL_DOMAINS (frontend domains) from the env files and domains with port number. Be aware that the passed domains are for the backend and the frontend.

Furthermore we prefix the api route for sanctum authentication.

```php sanctum.php
/*
|--------------------------------------------------------------------------
| Stateful Domains
|--------------------------------------------------------------------------
|
| Requests from the following domains / hosts will receive stateful API
| authentication cookies. Typically, these should include your local
| and production domains which access your API via a frontend SPA.
|
*/

'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,127.0.0.1:3000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),

/*
|--------------------------------------------------------------------------
| Sanctum Route prefix
|--------------------------------------------------------------------------
|
*/

'prefix' => 'api',

```

## adjust config/cors.php

Enable cors features for laravel backend used by sanctum and frontend app

```php cors.php

# allows the FRONTEND_URL defined in env file to have access on the rest api
'allowed_origins' => [env('FRONTEND_URL', '*')],
# allows user login from the frontend app (post login user)
'supports_credentials' => true,
```

## setup cookie authentication (session and xsrf)

A good guide can be found here: <https://madewithlove.com/blog/cookie-based-authentication-with-laravel-sanctum/>, the resources are worth to look at.
Since the setup is easy but it is even easier to miss things that make debugging very hard. FYI: some things have to be debugged though.

## adjust laravel env file

For development purposes, frontend and backend are running on different ports.

```.env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

FYI sanctum:
Frontend and Api need to share the same top-level-domain. By default, the cookie will be available to the top-level domain and all subdomains.

We need to set the session domain

```.env
SESSION_DOMAIN=localhost
# SESSION_DOMAIN=.example.test -> valet or Herd
# SESSION_DOMAIN=.example.com -> production
```

The value for SANCTUM_STATEFUL_DOMAINS needed in config/sanctum.php for development should be the localhost with port that is used by the frontend dev server and for production the top level domain. In production the fe react application will be served on frontend.sokdesign.de and the backend will be served on sokdesign.de.

```.env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,frontend.sokdesign.de
```

FYI:

Remember to update .env.example as .env is ignored in version control, and since .env.example will be used in creating .env when the project is cloned again by another developer or the DevOps when deploying the project.

You should NOT include the scheme (http:// or https://) or a trailing slash /. you should only add the host (the domain or the IP) and the port (if it exists).

The front end and the API must live under the same top-level domain. which means if the frontend is served from sokdesign.de then the API must be on the same domain or on a subdomain.

## Test the configuration

### Laravel token Authentication (stateless) should still work

As we have preinstalled tests that worked before, they should still be running green after the sanctum setup.
E.G. So authentication with laravel tokens (not session cookies) for stateless applications should still work.

```bash
php artisan test


PASS  Tests\Unit\ExampleTest
✓ example                                                                           0.76s

PASS  Tests\Feature\Auth\AuthenticationTest
✓ users can authenticate using the login screen                                     6.73s
✓ users can not authenticate with invalid password                                  0.36s
✓ users can logout                                                                  0.03s

PASS  Tests\Feature\Auth\EmailVerificationTest
✓ email can be verified                                                             0.18s
✓ email is not verified with invalid hash                                           0.81s

PASS  Tests\Feature\Auth\PasswordResetTest
✓ reset password link can be requested                                              0.95s
✓ password can be reset with valid token                                            0.14s

PASS  Tests\Feature\Auth\RegistrationTest
✓ new users can register                                                            0.05s

PASS  Tests\Feature\ExampleTest
✓ example
```

### Implement a LoginController and a Route Endpoint

Testing the sanctum statefulness requires a sanctum protected route.
Remember the configuration in sanctum.php where we prefixed sanctum with the api route?

In routes/api.php we we create a login endpoint to post login credentials.
FYI: The LoginController::class will be created with invoke method that handles all types of request action methods (post, get, put etc.)

```php api.php
Route::prefix('auth/spa')->group(function () {
    Route::post('login', LoginController::class)->middleware('guest');
});
```

#### What are invokable controllers?

Laravel Invokable Controllers: Simplify Route Handling for Faster Development

Invokable controllers are a special type of controller in Laravel that allow you to define a single \_\_invoke() method to handle a route instead of defining multiple action methods.

In Laravel, a controller is a PHP class that handles HTTP requests and manages the application's response. An invokable controller is a special type of controller in Laravel that allows you to define a single \_\_invoke() the method instead of defining multiple action methods like index(), store(), show() etc.

To create an invokable controller, you need to define a class with a \_\_invoke() method. Here's an example:

```php
class ExampleController extends Controller
{
    public function __invoke(Request $request)
    {
        return "Hello, World!";
    }
}
```

```bash
php artisan make:controller Api/Auth/Spa/LoginController --invokable
```

In the example above, we have created an invokable controller called ExampleController. It has a single \_\_invoke() method that returns the string "Hello, World!".

To use this controller, you can define a route like this:

```php
Route::get('/example', ExampleController::class);
```

In this route definition, we have specified the ExampleController class as the controller for the /example route. When a user visits this route, Laravel will automatically call the \_\_invoke() method on the ExampleController class and return the "Hello, World!" string.

In conclusion, an invokable controller in Laravel is a convenient way to define a single action for a particular route, without having to create multiple methods in your controller. It can make your code more concise and easier to read, and can help you build applications more quickly.

#### Create the LoginController to handle requests

```php
class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            # todo
            // $request->session()->regenerate();

            return response()->json(['message' => __('Welcome!')]);
        }

        throw ValidationException::withMessages([
            'email' => __('The provided credentials do not match our records.'),
        ]);
    }
}
```

### Test the routes

Calling all implemented routes with
php artisan route:list
will show the implemented routes and their controllers:

-   post api/auth/spa/login
-   get | head api/csrf-cookie

```bash
php artisan route:list

GET|HEAD   / .......................................................................................
POST       api/auth/spa/login ......................................... Api\Auth\Spa\LoginController
GET|HEAD   api/csrf-cookie ....... sanctum.csrf-cookie › Laravel\Sanctum › CsrfCookieController@show
GET|HEAD   api/test ................................................................................
POST       email/verification-notification verification.send › Auth\EmailVerificationNotificationCo…
POST       forgot-password ................. password.email › Auth\PasswordResetLinkController@store
POST       login ................................. login › Auth\AuthenticatedSessionController@store
POST       logout ............................. logout › Auth\AuthenticatedSessionController@destroy
POST       register ................................. register › Auth\RegisteredUserController@store
POST       reset-password ........................ password.store › Auth\NewPasswordController@store
GET|HEAD   storage/{path} ............................................................ storage.local
GET|HEAD   up ......................................................................................
GET|HEAD   user ....................................................................................
GET|HEAD   verify-email/{id}/{hash} ............... verification.verify › Auth\VerifyEmailController
```

## Create Test User

To try out the login endpoint, we need a one test user.

```php DatabaseSeeder.php
<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Sok',
            'email' => 'sok@example.com',
            'password' => bcrypt('manager101'),
        ]);
    }
}

```

To seed the new user you can seed the new user and if a user already exits it can not be overwritten by default,
then just drop old db and seed new user table

```bash
php artisan db:seed
# or drop db and migrate and seed
php artisan migrate:fresh --seed
```

## Test cookie creation and login with Postman

Postman collections have the ability to structure use cases and make cookies available for the whole collection.

-   endpoint csrf-cookie (created by sanctum): We will check if the csrf and the session cookie will be created on the cookie route (api/csrf-cookie).
    This behavior mocks that the cookies are available in the browser.
-   endpoint login (in api.php): We will use a postman script that takes the cookie values and write it in a own cookie called x-xsrf-token that authenticates the user in postman (mocked browser behavior).
-   endpoint user (in api.php): if logged in it displays user data

More Information on <https://madewithlove.com/blog/cookie-based-authentication-with-laravel-sanctum/>

Before every request a script will be executed that adds parameters to the request header.

-   accept: application/json (to be able display json data on the response)
-   referer: localhost:5173 (locally running frontend)
-   X-XSRF-TOKEN: cookies.get("XSRF-TOKEN")

FYI: The script checks if a post method is called (login with post action for credentials), if so it sets a X-XSRF-TOKEN with the value of the cookies set by calling <http://localhost:8000/api/csrf-cookie>

```js scripts on root collection folder
pm.request.headers.add({ key: "accept", value: "application/json" });
pm.request.headers.add({
    key: "referer",
    // refer variable localhost:5173
    value: pm.collectionVariables.get("referer"),
});

if (pm.request.method.toLowerCase() !== "get") {
    // baseUrl variable http://localhost:8000/api
    const baseUrl = pm.collectionVariables.get("base_url");

    pm.sendRequest(
        {
            url: `${baseUrl}/csrf-cookie`,
            method: "GET",
        },
        function (error, response, { cookies }) {
            if (!error) {
                pm.request.headers.add({
                    key: "X-XSRF-TOKEN",
                    value: cookies.get("XSRF-TOKEN"),
                });
            }
        }
    );
}
```

It is recommended to debug and test the user authentication states in Postman before implementing and debugging the frontend rest calls.

## Frontend is react based and in another repository

With the configured LaravelAxiosClient we intercept requests and set a x-xsrf-token cookie from csrf-cookies if the request is not a get request.
Have look at the console tab for axios errors, network tab for http code, application tab for set cookies for debugging purposes.

```tsx
import axios from 'axios';
import Cookies from 'js-cookie';

const LaravelAxiosClient = axios.create({
 // baseURL: http://localhost:8000/api
 baseURL: import.meta.env.VITE_API_BASE_URL,
 headers: {
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json',
 },
});

LaravelAxiosClient.defaults.withCredentials = true; // allow sending cookies

LaravelAxiosClient.interceptors.request.use(async (config) => {
 if ((config.method as string).toLowerCase() !== 'get') {
  await LaravelAxiosClient.get('/csrf-cookie').then();
  config.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
 }

 return config;
});


function App() {
 useEffect(() => {
  const setAuth = async () => {
   await LaravelAxiosClient.post('/auth/spa/login', {
    email: 'sok@example.com',
    password: 'manager101',
    password_confirmation: 'manager101',
   });

   const { data } = await LaravelAxiosClient.get('/user');
   console.log(data); // should output user details.
  };

  setAuth();
 }, []);

    return(
        // your html
    )
}
```

## Implement Register, Login, Logout Controller and the according routes

As reference this page was helpful but had issues to run. The fixed on is found here.

The routes:

```php routes/api.php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
// ...
Route::middleware(['auth:sanctum'])->get('/user', fn(Request $request) => $request->user());
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::prefix('auth/spa')->group(function () {
    // Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

The Methods of the Controllers:

```php

// Controllers/Api/Auth/AuthController.php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function register(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // <-- erwartet password_confirmation
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Login the user after registration
        Auth::login($user);

        return response('User registered successfully and logged in after that');
    }
    public function login(Request $request): Response
    { {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate(); // REGENERATE SESSION ID

                // the current authenticated user is now available
                // http://localhost:8000/api/user
                // http://localhost:8000/api/get
                /**
                 * Route::middleware(['auth:sanctum'])->get('/user', fn(Request $request) => $request->user());
                 * Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
                 */
                return response('User logged successfully', 200);
            }

            throw ValidationException::withMessages([
                'email' => __('The provided credentials do not match our records.'),
            ]);
        }
    }

    public function logout(Request $request): Response
    {
        Auth::logout(); // For session-based authentication

        return response('Successfully logged out!');
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

```

Tested in Postman and Browser

```js
// base_url: http://localhost:8000/api
// POST {{base_url}}/auth/spa/register
{
    "name": "Foodie User",
    "email": "user@foodly.com",
    "password": "secret123",
    "password_confirmation": "secret123"
}
```

FYI: Bitte bedenken, dass das Frontend die password_confimration ebenfalls an den AuthController schickt.
Obwohl im AuthController der key password_confirmation nicht validiert oder in den User table geschreiben wird, wird die password_confirmation erwartet. Es wird Snake case erwartet.

# Frontend Implementierung in react

With axios we create an LaravelApiClient with axios to intercept all requests that have the baseUrl
localhost:<http://localhost:8000/api>.

1. axios.create() creates a config that needs credentials.

2. The axios interceptors.request.use fetches the current sanctum spa csrf-cookie every request (so the regenerated cookies are covered).
   And the csrf-cookie content will set to the to be config headers as X-XSRF-TOKEN. If the session cookie and the X-XSRF-TOKEN cookie match you are authenticated.
   As a reminder:
   the session cookie is set automatically by the laravel server (localhost:8000) and the csrf-cookie matches that cookie.
   The session cookie from laravel is httpOnly which makes it unnecessary to delete cookies on the frontend site.
   If the session cookie and the X-XSRF-TOKEN cookie divert you are not authenticated and you have to login again.

3. The axios interceptors.response.use provides logs on the most common http error status

```ts
import axios from "axios";
import Cookies from "js-cookie";

const LaravelApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
    },
    withCredentials: true,
});

LaravelApiClient.interceptors.request.use(
    async (config) => {
        const needsCsrf = ["post", "put", "patch", "delete"].includes(
            (config.method ?? "").toLowerCase()
        );
        if (needsCsrf) {
            await LaravelApiClient.get("/csrf-cookie").then();
            config.headers["X-XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

LaravelApiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn("Nicht autorisiert – ggf. ausgeloggt");
            }

            if (status === 419) {
                console.warn("CSRF-Token abgelaufen");
            }

            if (status === 422) {
                console.warn("Validierungsfehler:", error.response.data.errors);
            }
        }

        return Promise.reject(error);
    }
);

export default LaravelApiClient;
```

Register Requests with the LaravelApiClient calls the backend route that calls the AuthController with its according method.

logState is a boolean helper that can log the newly registered user.

```ts
import LaravelApiClient from "../plugins/axios";

const registerUser = async ({
    logState,
    name,
    email,
    password,
    password_confirmation,
}: {
    logState: boolean;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    await LaravelApiClient.post("/auth/spa/register", {
        name,
        email,
        password,
        password_confirmation,
    }).then((res) => {
        console.log("User", res.data);
    });

    if (logState) {
        // after await post, now get user data
        const { data } = await LaravelApiClient.get("/user");
        console.log("get User data, successful login", data);
    }
};

export default registerUser;
```

login Requests with the LaravelApiClient calls the backend route that calls the AuthController with its according method.

logState is a boolean helper that can log the currently logged in user.

```ts
import LaravelApiClient from "../plugins/axios";

const setLogin = async ({
    logState,
    email,
    password,
    password_confirmation,
}: {
    logState: boolean;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    await LaravelApiClient.post("/auth/spa/login", {
        email,
        password,
        password_confirmation,
    });

    if (logState) {
        const { data } = await LaravelApiClient.get("/user");
        console.log("get User data, successful login", data);
    }
};

export default setLogin;
```

logout Requests with the LaravelApiClient calls the backend route that calls the AuthController with its according method.

logState is a boolean helper that can log that the user is not authenticated.

```ts
import LaravelApiClient from "../plugins/axios";

const setLogout = async (logState: boolean) => {
    await LaravelApiClient.post("/auth/spa/logout");

    if (logState)
        await LaravelApiClient.get("/me") // for this route authentication is needed
            .then((res) => {
                console.log("User is logged in:", res.data);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    console.log("User is not logged in");
                }
            });
};

export default setLogout;
```

# Social Auth Services

Laravel offers a plugin for auth services to logins called sociallite.

-   <https://laravel.com/docs/12.x/socialite>
-   <https://www.itsolutionstuff.com/post/laravel-12-socialite-login-with-google-account-exampleexample.html>

## Google cloud

-   <https://console.cloud.google.com/>

Offers Api services like OAuth2.0 that laravel sociallite needs to authenticate with. Please use the step by step example to create a 'project' in the google cloud.

The configuration of this project provides that are needed to connec with the sociallite service:

-   client-id
-   client-key
-   redirect-url

## Github registration with laravel socialite, spa and react

To register with github oauth a user have to visit a url that you can declare while making an oauth app in github.
The user will be redirected to an web interface to login with github. If log in is successful the declared url (callback url) is called by github.
The backend receives via this callback url the user data and saves it as user data.
Also the frontend listens to the callback url to see if the user is registered.

-   create oauth app in github
    -   create a new project
        -   create a authorization callback url <http://localhost:8000/api/auth/github/callback>
        -   create credentials for safe backend communication: Client Id and Client Secret
-   backend

    -   install socialite plugin for github oauth process
    -   create config for github Client Id and Client Secret
    -   create routes to redirect to github and github callback for processed login
    -   create controller with methods to redirect to github login and handle github callback to login or create a user and to redirect to an url accessible by frontend

-   frontend
    -   create button for github oauth request: <http://localhost:8000/api/auth/github>
    -   create a route for github callback: <http://localhost:8000/api/auth/github/callback>
    -   create a component that is used on that route. In a try / catch block: It checks if the user is logged in and redirects, otherwise it logs the error and redirects.

### create oauth app in github

github provides a oauth service that can be configured or newly created on github page whe logged in.
<https://github.com/settings/developers>

To create a new one click the 'New OAuth app' Button and follow the instructions.

-   Application name
-   Homepage URL
-   Authorization callback URL

For Single Page Apps with web api oauth you should not 'Enable Device Flow'. This would be of use if you have users that you can manage to be authorized with a CLI Tool or GitCredentialManager. Which we do not use or need.

-   application name makes OAuth app distinctable on OAuth app. I used 'laravel, sanctum spa, socialite and mui'
-   Homepage URL. <https://www.sokdesign.de/>
-   Authorization callback URL <http://localhost:8000/api/auth/github/callback>

When passing the three values a new project gets created.
A Client ID, a client secret will be provided. You should note them immediately because the secret will not be accessible an the second visit of the passage.

### backend

install socialite plugin for github oauth process

```bash
composer require laravel/socialite
```

create config for github Client Id and Client Secret. Be aware that the given GITHUB_REDIRECT_URI contains

-   the oauth request: <http://localhost:8000/api/auth/github>
-   and the oauth callback: <http://localhost:8000/api/auth/github/callback>

```sh .env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

```php service.php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI'),
],
```

create routes to redirect to github and github callback for processed login

```php
# routes api.php
# oauth request: localhost:8000/api/auth/github
Route::get('/auth/github', [SocialiteController::class, 'redirectToGithub']);
# oauth callback: localhost:8000/api/auth/github/callback
Route::get('/auth/github/callback', [SocialiteController::class, 'handleGithubCallback']);
```

create controller with methods

-   to redirect to github login
-   and handle github callback
    -   to login
    -   or create a user
    -   and to redirect to an url accessible by frontend ('<http://localhost:5173/auth/callback?logged_in=true>')

```php
<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;


class SocialiteController extends Controller
{
    public function redirectToGithub(): RedirectResponse
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    public function handleGithubCallback()
    {
        $githubUser = Socialite::driver('github')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $githubUser->getEmail()],
            [
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'password' => bcrypt(uniqid()), // placeholder
            ]
        );

        Auth::login($user); // session-based login
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?logged_in=true');
    }
}
```

### frontend

create button for github oauth request: <http://localhost:8000/api/auth/github>

```tsx SignUp.tsx
const handleGithubSignIn = () => {
    window.location.href = `${apiBaseUrl}/auth/github`;
};

<Button
    fullWidth
    variant="outlined"
    onClick={handleGithubSignIn}
    startIcon={<GithubIcon />}
    {...testId("form-button-register-with-github")}
>
    registrieren mit Github
</Button>;
```

create the route created by backend ('<http://localhost:5173/auth/callback>')

It is not the auth/github/callback route.

```tsx routes.tsx
const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        //
    },
    {
        path: "/auth/callback",
        element: <AuthCallback />,
    },
];
```

create a component that is used on that route.
In a try / catch block: It checks if the user is logged in and redirects, otherwise it logs the error and redirects.

```tsx
// AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LaravelApiClient from "../../plugins/axios";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        LaravelApiClient.get("/me")
            .then((res) => {
                console.log("Logged in user:", res.data);
                navigate("/");
            })
            .catch((err) => {
                console.log("Not logged in:", err);
                navigate("/");
            });
    }, []);

    return <p>Logging in...</p>;
};

export default AuthCallback;
```

# Best Practices for Testing Laravel Sanctum SPA with Pest

1. Structure Your Tests Clearly
   Use tests/Feature for SPA routes (e.g., login, register, api/me)

Use tests/Unit for business logic or service classes

Follow a file naming convention like Auth/LoginTest.php, Auth/RegisterTest.php

---

2. Use Laravel’s Built-in Test Helpers
   Laravel’s Sanctum::actingAs() is perfect for simulating an authenticated user:

```php

use Laravel\Sanctum\Sanctum;
use App\Models\User;

test('authenticated user can access /api/me', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/me');

    $response->assertOk()
             ->assertJson(['email' => $user->email]);
});
```

---

3. Test Authentication Endpoints Thoroughly
   ✅ Successful login, logout, register

❌ Invalid credentials

❌ Missing CSRF token

🕓 Expired session/token

Example for login:

```php
test('user can log in with correct credentials', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/auth/spa/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk();
});
```

---

4. Handle CSRF Cookies in SPA
   Sanctum uses GET /sanctum/csrf-cookie to initialize CSRF protection. When testing, you can skip it, since Laravel disables CSRF protection in tests by default.

But if you want full realism:

```php
$this->get('/sanctum/csrf-cookie'); // optional
```

---

5. Use Factories to Create Users and Models
   Use User::factory() rather than seeding manually. Write short and expressive tests:

```php
$user = User::factory()->create();
```

---

6. Test Protected Routes
   Ensure unauthorized users are blocked:

```php
test('guest cannot access protected route', function () {
    $response = $this->getJson('/api/me');

    $response->assertUnauthorized();
});
```

---

7. Database Reset
   Use RefreshDatabase to start fresh:

```php
uses(RefreshDatabase::class);
```

This makes every test isolated and clean.

---

8. Group Your Tests Logically
   Use describe() and it() to improve clarity:

```php
describe('Authentication', function () {
    test('can register a user', function () {
        // ...
    });

    test('cannot register with missing fields', function () {
        // ...
    });
});
```

✅ Suggested Tests to Cover for Sanctum SPA

| Functionality      | Test Description                                      |
| ------------------ | ----------------------------------------------------- |
| **Login**          | Success, wrong password, invalid email                |
| **Register**       | Success, duplicate email, validation errors           |
| **Logout**         | Logs out and cannot access protected routes afterward |
| **/api/me**        | Returns correct user data when authenticated          |
| **CSRF cookie**    | `/sanctum/csrf-cookie` sets cookie correctly          |
| **Access control** | Guest cannot access `/api/user` or `/api/me`          |

---

Optional Pest Plugin
If you want to further organize or prettify your tests:

```bash
composer require pestphp/pest-plugin-laravel
```

## What Is a Feature Test?

Feature tests test how your application behaves as a whole — usually HTTP requests, route controllers, middleware, policies, etc.

✨ You’re testing a feature if:
It touches the framework (routes, DB, auth).

It sends an actual HTTP request (e.g. $this->post('/api/login')).

It might span multiple layers (e.g. controller + model + response).

🧪 Examples of Feature Tests

| **File**                              | **Responsibility**                                                   |
| ------------------------------------- | -------------------------------------------------------------------- |
| `tests/Feature/Auth/LoginTest.php`    | Test `/api/login` route: correct credentials log in, wrong ones fail |
| `tests/Feature/User/ProfileTest.php`  | Test `GET /api/me` returns authenticated user's data                 |
| `tests/Feature/Auth/RegisterTest.php` | Ensure a new user is created and authenticated after registration    |
| `tests/Feature/Auth/LogoutTest.php`   | Ensure `/api/logout` revokes token or session                        |

💡 Think of Feature tests as black-box tests — send input, assert output.

## What Is a Unit Test?

Unit tests focus on isolated logic, often in service classes, helpers, or pure PHP methods — they should not touch the database or Laravel internals if possible.

✨ You’re testing a unit if:
It doesn't hit a route or controller.

You’re testing one class or method in isolation.

You're mocking dependencies (e.g. an API client or repository).

🧪 Examples of Unit Tests

| **File**                                               | **Responsibility**                                           |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `tests/Unit/Services/UserServiceTest.php`              | Test a method like `UserService::createUserFromGitHubData()` |
| `tests/Unit/Utils/StringHelperTest.php`                | Test a function like `slugify("My Post") => "my-post"`       |
| `tests/Unit/Notifications/NewUserNotificationTest.php` | Test the notification formatting                             |
| `tests/Unit/Rules/ValidReferralCodeTest.php`           | Test a custom validation rule logic                          |

💡 Think of Unit tests as microscope-level tests — test one component, mock the rest.

## 🔍 Quick Rules of Thumb

| Ask Yourself...                                         | If yes, it’s likely a... |
| ------------------------------------------------------- | ------------------------ |
| Does it go through a Laravel route/controller?          | Feature Test             |
| Does it hit the database or authentication?             | Feature Test             |
| Does it only test one class’s logic with no HTTP calls? | Unit Test                |
| Does it rely on mocks or fakes for dependencies?        | Unit Test                |

# Use sociallite and connect to google cloud oauth service

Since github registration with github oauth registration worked, this code will be used fora ll google and github registration.

1. create an oauth service in google cloud
2. grab client_id, client_secret and redirect from oauth service for configuration
    - service.php
    - env files
3. Backend refactor existing code
    - SocialiteController to BaseSocialiteController
    - GithubController and GoogleController extending BaseSocialiteController
    - api.php extending routes and use new Controllers
4. Frontend
    - Refactor ClickHandler to a reuseable Clickhandler

### Create an oauth service in google cloud

As registered Google user visit google cloud dashboard: <https://console.cloud.google.com/welcome>

Then visit "Api und Dienste" anschließend "Anmeldedaten" all in the main menu. In the category "Anmeldedaten" click the button "+ Anmeldedaten erstellen", chose "O-Auth-Client-Id" to create the data for your app development.

-   name of the application: pick the same as github oauth for consistency (laravel sanctum spa, socialite and mui)
-   grab client_id (Client ID)
-   grab client_secret (Client-Schlüssel)
-   redirect for Webserver (Autorisierte Weiterleitungs-URIs): pick the same url pattern like github oauth for consistency (<http://localhost:8000/api/auth/google/callback>)

### grab client_id, client_secret and redirect from oauth service for configuration

In config/services.php you need to pass client-id, client-key and redirect-url from the google OAUTH service

```php services.php
return [
    ....

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'), // client-id
        'client_secret' => env('GOOGLE_CLIENT_SECRET'), // client-key
        'redirect' => env('GOOGLE_REDIRECT'), // redirect-url
    ],
]
```

The env file with the data

```bash .env
GOOGLE_CLIENT_ID=XXXXXsvqcn3d.apps.googleusercontent.com # client-id
GOOGLE_CLIENT_SECRET=XXXXXT6tR1rWpR-Jxy3jkdzs  # client-key
GOOGLE_REDIRECT=http://localhost:8000/auth/google/callback # redirect-url
```

### Backend refactor existing code

Rewrite the SocialiteController to BaseSocialiteController. That can be extended by Github- and GoogleController

```php
// app/Http/Controllers/Auth/BaseSocialiteController.php
<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;

abstract class BaseSocialiteController extends Controller
{
    abstract protected function provider(): string;

    protected function redirectUrl(): string
    {
        return Socialite::driver($this->provider())->stateless()->redirect()->getTargetUrl();
    }

    protected function getUserFromProvider()
    {
        return Socialite::driver($this->provider())->stateless()->user();
    }

    public function redirect(): RedirectResponse
    {
        return redirect($this->redirectUrl());
    }

    public function callback(Request $request)
    {
        if ($request->has('error')) {
            return redirect('/')->with('error', 'You did not authorize the app.');
        }

        $providerUser = $this->getUserFromProvider();

        $user = User::firstOrCreate(
            ['email' => $providerUser->getEmail()],
            [
                'name' => $providerUser->getName() ?? $providerUser->getNickname(),
                'password' => bcrypt(uniqid()), // Placeholder password
            ]
        );

        Auth::login($user);
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?logged_in=true');
    }
}

// app/Http/Controllers/Auth/GithubController.php
<?php

namespace App\Http\Controllers\Api\Auth\Spa;

class GithubController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'github';
    }
}

// app/Http/Controllers/Auth/GoogleController.php
class GoogleController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'google';
    }
}

// routes/api.php
Route::get('/auth/github', [GithubController::class, 'redirect']);
Route::get('/auth/github/callback', [GithubController::class, 'callback']);

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
```

Now the routes concerning extended BaseSocialiteController all call the same methods redirect and callback.

### Frontend

The Frontend just needs to hit the route provided by the webserver (backend) for redirects.
That would be <http://localhost:8000/api/auth/github> or <http://localhost:8000/api/auth/github> tha would be then redirect to the auth services.

```tsx
const handleSignUp = (provider: string) => {
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
};
```

To make the mui Button interface easier to read we refacor the component

```tsx
// not refactored
<Button
    fullWidth
    variant="outlined"
    startIcon={<GithubIcon />}
    {...testId("form-button-register-with-github")}
    onClick={() => alert("Sign up with Facebook")}
>
    registrieren mit Facebook
</Button>

// refactored
<RegisterButtonSocialite
    startIcon={<GithubIcon />}
    text="registrieren mit Github"
    testIdIdentifier="form-button-register-with-github"
    clickHandler={() => handleSignUp('github')}
/>
<RegisterButtonSocialite
    startIcon={<GoogleIcon />}
    text="registrieren mit Google"
    clickHandler={() => handleSignUp('google')}
    testIdIdentifier="form-button-register-with-google"
/>

// RegisterButtonSocialite.tsx
const RegisterButtonSocialite: FC<RegisterButtonSocialiteProps> = ({
    startIcon,
    text,
    testIdIdentifier,
    clickHandler,
}) => {
    return (
        <Button
            fullWidth
            variant="outlined"
            onClick={clickHandler}
            startIcon={startIcon}
            {...testId(testIdIdentifier)}
        >
            {text}
        </Button>
    );
};
```

### Debugging Tipps

Since Socialite needs three parameters but the oauth services offer a variety of more parameters it is helpful to check them across oauth services to have the same pattern

redirects
<http://localhost:8000/api/auth/github>
<http://localhost:8000/api/auth/google>

callbacks
<http://localhost:8000/api/auth/github/callback>
<http://localhost:8000/api/auth/google/callback>

#### env name: github oauth name

The namings of the parameters change often but value is not. Make sure to check the parameters are set right.

```sh example_env
GITHUB_CLIENT_ID: client id
GITHUB_CLIENT_SECRET: client secret
GITHUB_REDIRECT_URI: Authorization callback URL

GOOGLE_CLIENT_ID: Client-ID
GOOGLE_CLIENT_SECRET: Clientschlüssel
GOOGLE_REDIRECT: Autorisierte Weiterleitungs-URIs
```

```php services.php

'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI'),
],

'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

```php
// routes/api.php
Route::get('/auth/github', [GithubController::class, 'redirect']);
Route::get('/auth/github/callback', [GithubController::class, 'callback']);

// BaseSocialiteController.php
public function callback(Request $request)
{
    if ($request->has('error')) {
        return redirect('/')->with('error', 'You did not authorize the app.');
    }

    $providerUser = $this->getUserFromProvider();

    $user = User::firstOrCreate(
        ['email' => $providerUser->getEmail()],
        [
            'name' => $providerUser->getName() ?? $providerUser->getNickname(),
            'password' => bcrypt(uniqid()), // Placeholder password
        ]
    );

    Auth::login($user);
    return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?logged_in=true');
}
```

```tsx
const handleSignUp = (provider: string) => {
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
};

// ... calling the redirects not the callback routes. The callback routes are executed by the oauth services
  <RegisterButtonSocialite
    startIcon={<GithubIcon />}
    text="registrieren mit Github"
    testIdIdentifier="form-button-register-with-github"
    clickHandler={() => handleSignUp('github')}
/>
<RegisterButtonSocialite
    startIcon={<GoogleIcon />}
    text="registrieren mit Google"
    clickHandler={() => handleSignUp('google')}
    testIdIdentifier="form-button-register-with-google"
/>
```
