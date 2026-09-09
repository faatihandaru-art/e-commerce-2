<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()?->load('roles'),
            ],
            'notifications' => fn () => $request->user()
                ? $this->notificationFeed($request->user())
                : [
                    'unread' => 0,
                    'items' => [],
                ],
            'flash' => fn () => [
                'success' => $request->session()->get('success'),
            ],
        ];
    }

    /**
     * @return array{unread: int, items: array<int, array<string, mixed>>}
     */
    protected function notificationFeed(mixed $user): array
    {
        $items = $user->notifications()
            ->latest()
            ->limit(6)
            ->get()
            ->map(function (DatabaseNotification $notification) {
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
            ->values()
            ->all();

        return [
            'unread' => $user->unreadNotifications()->count(),
            'items' => $items,
        ];
    }
}
