<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artisans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('business_name');
            $table->string('speciality');
            $table->string('location');
            $table->text('bio');
            $table->decimal('rating', 3, 1)->nullable();
            $table->string('image')->nullable();
            $table->json('social_media_links')->nullable();
            $table->enum('status', ['pending', 'active', 'suspended'])->default('pending');
            $table->enum('id_verification_status', ['not_started', 'pending', 'confirmed', 'rejected'])->default('not_started');
            $table->text('verification_rejection_reason')->nullable();
            $table->timestamp('id_verified_at')->nullable();
            $table->string('id_document_front_path')->nullable();
            $table->string('id_document_back_path')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artisans');
    }
};
