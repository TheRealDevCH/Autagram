<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->text('reason')->nullable();
            $table->boolean('read')->default(false);
            $table->json('data')->nullable();
            $table->timestamps();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false);
            $table->text('deletion_reason')->nullable();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['is_deleted', 'deletion_reason', 'deleted_by', 'deleted_at']);
        });

        Schema::dropIfExists('notifications');
    }
};
