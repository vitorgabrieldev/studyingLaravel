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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('status', 20)->default('active');
            $table->string('nickname')->nullable();
            $table->string('brand', 30)->default('Visa');
            $table->string('last4', 4);
            $table->text('pan');
            $table->text('cvv');
            $table->unsignedTinyInteger('exp_month');
            $table->unsignedSmallInteger('exp_year');
            $table->unsignedBigInteger('limit_cents')->default(0);
            $table->boolean('international_enabled')->default(false);
            $table->boolean('online_enabled')->default(true);
            $table->boolean('contactless_enabled')->default(true);
            $table->timestamp('replaced_at')->nullable();
            $table->timestamps();

            $table->index(['account_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
