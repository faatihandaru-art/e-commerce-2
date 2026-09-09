<?php

namespace App\Observers;

use App\Models\OrderNote;
use App\Support\Activity;

class OrderNoteObserver
{
    public function created(OrderNote $note): void
    {
        Activity::record('note_added', $note, [
            'link' => $note->order ? route('admin.orders.show', $note->order) : route('admin.orders.index'),
        ]);
    }
}
