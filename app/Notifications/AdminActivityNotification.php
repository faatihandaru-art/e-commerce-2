<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AdminActivityNotification extends Notification
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public string $title,
        public string $message,
        public string $action = 'updated',
        public ?string $subjectType = null,
        public ?int $subjectId = null,
        public ?string $actor = null,
        public ?string $link = null,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'action' => $this->action,
            'subject_type' => $this->subjectType,
            'subject_id' => $this->subjectId,
            'actor' => $this->actor,
            'link' => $this->link,
        ];
    }
}
