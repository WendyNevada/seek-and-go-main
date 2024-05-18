<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderApprovedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $orderNo, $agencyName;

    /**
     * Create a new message instance.
     */
    public function __construct($orderNo, $agencyName)
    {
        $this->orderNo = $orderNo;
        $this->agencyName = $agencyName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Approved Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.OrderApprovedMail',
            with: [
                'orderNo' => $this->orderNo,
                'agencyName' => $this->agencyName
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
