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
        Schema::table('portfolio_gallery', function (Blueprint $table) {
            $table->longText('image_path')->change();
        });
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->longText('image')->change();
        });
        Schema::table('portfolio_profile', function (Blueprint $table) {
            $table->longText('avatar_url')->change();
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_gallery', function (Blueprint $table) {
            $table->string('image_path')->change();
        });
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->string('image')->change();
        });
        Schema::table('portfolio_profile', function (Blueprint $table) {
            $table->string('avatar_url')->change();
        });
    }
};
