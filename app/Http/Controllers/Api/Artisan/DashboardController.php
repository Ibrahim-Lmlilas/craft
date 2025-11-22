<?php

namespace App\Http\Controllers\Api\Artisan;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Product;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function statistics()
    {
        $artisan = Auth::user()->artisan;
        if (!$artisan) {
            return response()->json(['message' => 'Artisan not found.'], 404);
        }

        // Total Products
        $totalProducts = Product::where('artisan_id', $artisan->id)->count();
        $activeProducts = Product::where('artisan_id', $artisan->id)
            ->where('status', 'active')
            ->count();

        // Total Auctions
        $totalAuctions = Auction::where('artisan_id', $artisan->id)->count();
        $activeAuctions = Auction::where('artisan_id', $artisan->id)
            ->where('status', 'active')
            ->count();
        $endedAuctions = Auction::where('artisan_id', $artisan->id)
            ->where('status', 'ended')
            ->count();

        // Total Revenue (from ended auctions with bids)
        $totalRevenue = Auction::where('artisan_id', $artisan->id)
            ->where('status', 'ended')
            ->where('bid_count', '>', 0)
            ->sum('price');

        // Total Bids received
        $totalBids = Bid::whereHas('auction', function ($query) use ($artisan) {
            $query->where('artisan_id', $artisan->id);
        })->count();

        // Revenue trend (last 7 days)
        $revenueTrend = Auction::where('artisan_id', $artisan->id)
            ->where('status', 'ended')
            ->where('bid_count', '>', 0)
            ->where('end_date', '>=', Carbon::now()->subDays(7))
            ->select(
                DB::raw('DATE(end_date) as date'),
                DB::raw('SUM(price) as revenue'),
                DB::raw('COUNT(*) as auctions_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Auctions by status (last 30 days)
        $auctionsByStatus = Auction::where('artisan_id', $artisan->id)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();

        // Bids trend (last 7 days)
        $bidsTrend = Bid::whereHas('auction', function ($query) use ($artisan) {
            $query->where('artisan_id', $artisan->id);
        })
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as bids_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Products by status
        $productsByStatus = Product::where('artisan_id', $artisan->id)
            ->select(
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();

        return response()->json([
            'summary' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'total_auctions' => $totalAuctions,
                'active_auctions' => $activeAuctions,
                'ended_auctions' => $endedAuctions,
                'total_revenue' => (float) $totalRevenue,
                'total_bids' => $totalBids,
            ],
            'revenue_trend' => $revenueTrend,
            'auctions_by_status' => $auctionsByStatus,
            'bids_trend' => $bidsTrend,
            'products_by_status' => $productsByStatus,
        ]);
    }
}

