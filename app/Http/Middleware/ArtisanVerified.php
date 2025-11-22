<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ArtisanVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if user has artisan role
        if (!$user->hasRole('artisan')) {
            return response()->json(['message' => 'You must be an artisan to access this resource.'], 403);
        }

        // Check if email is verified (unless registered via Google which auto-verifies)
        if (!$user->hasVerifiedEmail() && !$user->google_id) {
            return response()->json([
                'message' => 'Please verify your email address first.',
                'requires_email_verification' => true
            ], 403);
        }

        // Check if artisan profile exists
        if (!$user->artisan) {
            return response()->json([
                'message' => 'Please complete your artisan profile first.',
                'requires_profile_completion' => true
            ], 403);
        }

        // Check if admin has verified the artisan
        if ($user->artisan->id_verification_status !== 'confirmed') {
            return response()->json([
                'message' => 'Your artisan account is pending admin verification. Please wait for approval.',
                'verification_status' => $user->artisan->id_verification_status,
                'requires_admin_verification' => true
            ], 403);
        }

        // Check if artisan status is active
        if ($user->artisan->status !== 'active') {
            return response()->json([
                'message' => 'Your artisan account is not active. Please contact support.',
                'status' => $user->artisan->status
            ], 403);
        }

        return $next($request);
    }
}

