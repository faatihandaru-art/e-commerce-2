<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Customer\Actions\RegisterCustomerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Auth;

class RegisteredUserController extends Controller
{
    public function store(RegisterRequest $request, RegisterCustomerAction $action)
    {
        $user = $action->execute($request->validated());
        Auth::login($user);

        return redirect()->route('home');
    }
}