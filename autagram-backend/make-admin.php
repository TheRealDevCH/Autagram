<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

if ($argc < 2) {
    echo "Usage: php make-admin.php <email>\n";
    exit(1);
}

$email = $argv[1];

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User with email '$email' not found.\n";
    exit(1);
}

$user->is_admin = true;
$user->save();

echo "User '{$user->username}' ({$user->email}) is now an admin!\n";

