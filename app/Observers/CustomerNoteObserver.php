<?php

namespace App\Observers;

use App\Models\CustomerNote;
use App\Support\Activity;

class CustomerNoteObserver
{
    public function created(CustomerNote $note): void
    {
        $customer = $note->customer;
        $customerName = $customer?->name ?? '#';

        Activity::record('note_added', $note, [
            'label' => "customer '{$customerName}'",
            'actor_id' => $note->created_by,
            'after' => ['note' => mb_strimwidth($note->note, 0, 80, '…')],
            'link' => $customer ? route('admin.customers.show', $customer) : route('admin.customers.index'),
        ]);
    }

    public function deleted(CustomerNote $note): void
    {
        $customer = $note->customer;
        $customerName = $customer?->name ?? '#';

        Activity::record('note_deleted', $note, [
            'label' => "customer '{$customerName}'",
            'before' => ['note' => mb_strimwidth($note->note, 0, 80, '…')],
            'link' => $customer ? route('admin.customers.show', $customer) : route('admin.customers.index'),
        ]);
    }
}
