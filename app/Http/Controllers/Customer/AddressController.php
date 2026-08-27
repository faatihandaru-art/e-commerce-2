<?php

namespace App\Http\Controllers\Customer;

use App\Domain\Customer\Actions\SaveCustomerAddressAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreAddressRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function store(StoreAddressRequest $request, SaveCustomerAddressAction $action): RedirectResponse
    {
        $action->execute(Auth::user(), $request->validated());

        return redirect()->route('account.addresses')->with('success', 'Alamat berhasil disimpan.');
    }

    public function destroy(int $id): RedirectResponse
    {
        Auth::user()->addresses()->where('id', $id)->delete();

        return redirect()->route('account.addresses')->with('success', 'Alamat berhasil dihapus.');
    }
}
