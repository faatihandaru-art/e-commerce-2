<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerNote;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers for admin.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = User::query()->customersOnly();

        // Filter status (active / inactive / banned)
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Search by name, email, or phone
        $search = trim((string) $request->input('search', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Aggregations
        $query->withCount('orders as total_orders')
            ->withSum(['orders as total_spent' => fn ($q) => $q->where('payment_status', 'paid')], 'grand_total')
            ->withMax('orders as last_order_at', 'placed_at');

        // Sorting
        $sortBy = (string) $request->input('sort_by', 'created_at');
        $sortOrder = strtolower((string) $request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['total_spent', 'last_order_at', 'total_orders', 'name', 'email', 'created_at', 'status'];
        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->latest('created_at');
        }

        $perPage = $request->integer('per_page', 10);
        $customers = $query->paginate($perPage)->withQueryString();

        $customers->setCollection(
            $customers->getCollection()->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'total_orders' => (int) ($user->total_orders ?? 0),
                'total_spent' => (int) ($user->total_spent ?? 0),
                'last_order_at' => $user->last_order_at ? Carbon::parse($user->last_order_at)->toIso8601String() : null,
                'created_at' => $user->created_at?->toIso8601String(),
            ])
        );

        $filters = [
            'search' => $search,
            'status' => (string) $request->input('status', ''),
            'sort_by' => $sortBy,
            'sort_order' => $sortOrder,
        ];

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'customers' => $customers,
                'filters' => $filters,
            ]);
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $filters,
        ]);
    }

    /**
     * Display details of a specific customer.
     */
    public function show(User $user, Request $request): Response|JsonResponse
    {
        // Ensure user is a customer
        if (! $user->roles()->where('slug', 'customer')->exists()) {
            abort(404, 'Customer tidak ditemukan.');
        }

        $addresses = $user->customerAddresses()
            ->orderByDesc('is_default')
            ->get()
            ->map(fn ($addr) => [
                'id' => $addr->id,
                'recipient' => $addr->recipient,
                'phone' => $addr->phone,
                'street' => $addr->street,
                'village' => $addr->village,
                'district' => $addr->district,
                'city' => $addr->city,
                'province' => $addr->province,
                'postal_code' => $addr->postal_code,
                'country' => $addr->country,
                'latitude' => $addr->latitude,
                'longitude' => $addr->longitude,
                'is_default' => (bool) $addr->is_default,
            ]);

        $orders = $user->orders()
            ->latest()
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'grand_total' => (int) $order->grand_total,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'fulfillment_status' => $order->fulfillment_status,
                'placed_at' => $order->placed_at?->toIso8601String(),
                'created_at' => $order->created_at?->toIso8601String(),
            ]);

        $notes = $user->customerNotes()
            ->with('author:id,name,email')
            ->latest()
            ->get()
            ->map(fn ($note) => [
                'id' => $note->id,
                'note' => $note->note,
                'created_by' => $note->created_by,
                'author_name' => $note->author?->name ?? 'Staf System',
                'created_at' => $note->created_at?->toIso8601String(),
            ]);

        $data = [
            'customer' => [
                'profile' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at?->toIso8601String(),
                    'created_at' => $user->created_at?->toIso8601String(),
                    'updated_at' => $user->updated_at?->toIso8601String(),
                    'total_orders' => $user->totalOrders(),
                    'total_spent' => $user->totalSpent(),
                    'last_order_at' => $user->lastOrderAt()?->toIso8601String(),
                ],
                'addresses' => $addresses,
                'orders' => $orders,
                'notes' => $notes,
            ],
        ];

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($data);
        }

        return Inertia::render('Admin/Customers/Show', $data);
    }

    /**
     * Store a new note for a customer.
     */
    public function storeNote(Request $request, User $user): RedirectResponse|JsonResponse
    {
        if (! $user->roles()->where('slug', 'customer')->exists()) {
            abort(404, 'Customer tidak ditemukan.');
        }

        $validated = $request->validate([
            'note' => ['required', 'string', 'max:2000', function ($attribute, $value, $fail) {
                if (trim((string) $value) === '') {
                    $fail('Catatan tidak boleh kosong.');
                }
            }],
        ]);

        $note = CustomerNote::create([
            'user_id' => $user->id,
            'note' => trim($validated['note']),
            'created_by' => $request->user()->id,
        ]);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Catatan customer berhasil ditambahkan.',
                'note' => [
                    'id' => $note->id,
                    'note' => $note->note,
                    'created_by' => $note->created_by,
                    'author_name' => $request->user()->name,
                    'created_at' => $note->created_at?->toIso8601String(),
                ],
            ]);
        }

        return redirect()->back()->with('success', 'Catatan customer berhasil ditambahkan.');
    }

    /**
     * Delete a customer note.
     */
    public function destroyNote(CustomerNote $note, Request $request): RedirectResponse|JsonResponse
    {
        $note->delete();

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['message' => 'Catatan customer berhasil dihapus.']);
        }

        return redirect()->back()->with('success', 'Catatan customer berhasil dihapus.');
    }

    /**
     * Update customer active/inactive status.
     */
    public function updateStatus(Request $request, User $user): RedirectResponse|JsonResponse
    {
        // Double check user is a customer and not staff
        if (! $user->roles()->where('slug', 'customer')->exists() || $user->isStaff()) {
            abort(403, 'Aksi ini hanya dapat dilakukan untuk akun customer.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,banned',
        ]);

        $user->update([
            'status' => $validated['status'],
        ]);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Status customer berhasil diperbarui.',
                'status' => $user->status,
            ]);
        }

        return redirect()->back()->with('success', 'Status customer berhasil diperbarui.');
    }
}
