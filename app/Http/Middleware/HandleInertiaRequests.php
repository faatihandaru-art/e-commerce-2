<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share([
            'auth' => [
                'user' => fn () => $request->user()?->load('roles'),
            ],
            'flash' => fn () => [
                'success' => $request->session()->get('success'),
            ],
        ]);

        return $next($request);
    }
}
