import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { makeRequest } from '../lib/axois';
import { Loader2, ArrowLeft } from "lucide-react";
import Card from '@/components/auctions/card';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/auctions/hero';
import { Button } from '@/components/ui/button';

export interface Auction {
    id: number;
    price: number;
    reserve_price: number;
    bid_count: number;
    start_date: string;
    end_date: string;
    status: string;
    product: {
        id: number;
        name: string;
        description: string;
        images: Array<{
            id: number;
            path: string;
            is_primary: boolean;
        }>;
    };
    artisan: {
        id: number;
        business_name: string;
        user: {
            id: number;
            name: string;
        };
    };
}

const AuctionsPage: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();
    const navigate = useNavigate();

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const response = await makeRequest(api.get('/auctions'));
            if (response.success) {
                setAuctions(response.data.data);
            } else {
                setError(response.error?.message || 'Failed to fetch auctions');
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching auctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-200 bg-radial-at-br from-accent1/5 from-0% via-transparent via-50% to-transparent to-90%">
                        <Loader2 className="h-12 w-12 animate-spin text-accent1" />
                        <p className="mt-4 font-montserrat text-lg font-medium">Loading auctions...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full border border-gray-200 bg-radial-at-tr from-accent1/5 from-0% via-transparent via-50% to-transparent to-90%">
                        <p className="text-red-500 text-center font-montserrat font-medium">{error}</p>
                        <button 
                            onClick={fetchAuctions}
                            className="mt-4 w-full bg-accent1 text-black font-montserrat font-semibold py-2 rounded-full hover:bg-accent1/90"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {!user && <Hero />}
            
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-montserrat font-semibold">Discover Auctions</h1>
                        {user && (
                            <Button
                                onClick={() => navigate('/dashboard')}
                                variant="outline"
                                className="flex items-center gap-2 rounded-xl font-montserrat"
                            >
                                <ArrowLeft size={18} />
                                Back to Dashboard
                            </Button>
                        )}
                    </div>
                </div>

                {auctions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {auctions.map((auction) => (
                            <Card
                                key={auction.id}
                                auction={auction}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="bg-white p-8 rounded-3xl shadow-sm inline-block border border-gray-200 bg-radial-at-bl from-accent1/5 from-0% via-transparent via-50% to-transparent to-90%">
                            <p className="text-gray-600 font-montserrat font-medium">No auctions found.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionsPage;
