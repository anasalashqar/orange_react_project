<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Migrations\MigrationAlreadyExistsException;

class MigrationTest extends Migration
{
    public function up()
    {
        try {
            Schema::create('blogs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('user_id');
                $table->string('title');
                $table->text('content');
                $table->string('image')->nullable();
                $table->boolean('published')->default(true);
                $table->timestamps();
            });
        } catch (MigrationAlreadyExistsException $e) {
            // Handle the exception gracefully
        }
    }

    public function down()
    {
        Schema::dropIfExists('blogs');
    }

    public function testMigration()
    {
        $this->down();
        $this->up();
        $this->assertTrue(Schema::hasTable('blogs'));
    }
}