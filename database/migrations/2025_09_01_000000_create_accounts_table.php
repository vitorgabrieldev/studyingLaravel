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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('branch_number', 4);
            $table->string('account_number', 12);
            $table->string('account_digit', 2);
            $table->unsignedBigInteger('balance_cents')->default(0);
            $table->timestamps();

            $table->unique('user_id');
            $table->unique(['branch_number', 'account_number', 'account_digit']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
