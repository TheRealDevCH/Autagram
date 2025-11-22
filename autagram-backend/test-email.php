<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use App\Models\User;

$user = User::where('email', 'karanthphilipp5@gmail.com')->first();

if ($user) {
    echo "Sende Email an: " . $user->email . "\n";
    Mail::to($user->email)->send(new WelcomeMail($user));
    echo "Email wurde versendet!\n";
} else {
    echo "User nicht gefunden!\n";
}

