<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $notifications->setCollection(
            $notifications->getCollection()->map(function (DatabaseNotification $notification) {
                $data = $notification->data;

                return [
                    'id' => $notification->id,
                    'read' => $notification->read_at !== null,
                    'title' => $data['title'] ?? 'Aktivitas',
                    'message' => $data['message'] ?? '',
                    'link' => $data['link'] ?? null,
                    'time' => $notification->created_at->toIso8601String(),
                ];
            })
        );

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'notifications' => $notifications,
            ]);
        }

        return Inertia::render('Admin/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }

    public function markRead(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        if ($notification->notifiable_id === $request->user()->getKey()) {
            $notification->markAsRead();
        }

        return back();
    }
}
