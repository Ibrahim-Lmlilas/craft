<?php

namespace App\Console\Commands;

use App\Models\Artisan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AutoApproveArtisans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artisan:auto-approve';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically approve artisans after 5 minutes of pending verification';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find artisans that have been pending for 5 minutes or more
        $pendingArtisans = Artisan::where('id_verification_status', 'pending')
            ->whereNotNull('id_verification_pending_at')
            ->where('id_verification_pending_at', '<=', now()->subMinutes(5))
            ->get();

        $approvedCount = 0;

        foreach ($pendingArtisans as $artisan) {
            $artisan->update([
                'id_verification_status' => 'confirmed',
                'id_verified_at' => now(),
                'status' => 'active',
            ]);

            $approvedCount++;
            
            Log::info('Artisan auto-approved', [
                'artisan_id' => $artisan->id,
                'user_id' => $artisan->user_id,
                'pending_since' => $artisan->id_verification_pending_at,
            ]);
        }

        if ($approvedCount > 0) {
            $this->info("Auto-approved {$approvedCount} artisan(s).");
        } else {
            $this->info('No artisans to auto-approve.');
        }

        return Command::SUCCESS;
    }
}

