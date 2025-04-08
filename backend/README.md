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

It added an api.php file to the routes folder. Here are the routes for the api configured. The routes are prefixed with /api. Get rid of the pre-shipped protected user route that is sanctum protected and us a simple get user route to check if the /api/test route works.

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

## setup sanctum

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

## setup laravel env

Frontend and Api need to share the same top-level-domain. By default, the cookie will be available to the top-level domain and all subdomains.

So we set the session domain for development and production.

```.env
SESSION_DOMAIN=localhost,.sokdesign.de
# SESSION_DOMAIN=null
```

So we set the The SANCTUM_STATEFUL_DOMAINS for development and production.

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

### Implement api route with stateful sanctum

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
            $request->session()->regenerate();

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
-   get | head api/test

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

drop old db and seed new user table

```bash
php artisan migrate:fresh --seed
```
