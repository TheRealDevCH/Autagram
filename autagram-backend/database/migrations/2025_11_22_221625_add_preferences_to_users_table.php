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
        Schema::table('users', function (Blueprint $table) {
            $table->text('triggers')->nullable();
            $table->text('sensory_overload')->nullable();
            $table->text('interests')->nullable();
            $table->boolean('show_triggers')->default(true);
            $table->boolean('show_sensory_overload')->default(true);
            $table->boolean('show_interests')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['triggers', 'sensory_overload', 'interests', 'show_triggers', 'show_sensory_overload', 'show_interests']);
        });
    }
};
