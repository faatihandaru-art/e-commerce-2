<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if ($user && $user->isStaff()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('home');
    }

    public function destroy()
    {
        Auth::logout();

        return redirect()->route('home');
    }
}