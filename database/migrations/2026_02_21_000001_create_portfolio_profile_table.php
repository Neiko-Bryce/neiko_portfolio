<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_profile', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('headline')->nullable();
            $table->string('location')->nullable();
            $table->text('about')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('email')->nullable();
            $table->string('schedule_call_url')->nullable();
            $table->string('blog_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_profile');
    }
};
