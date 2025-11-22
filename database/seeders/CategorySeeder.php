<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Pottery & Ceramics',
                'slug' => 'pottery-ceramics',
                'description' => 'Handcrafted pottery, ceramics, and clay works',
                'parent_id' => null,
            ],
            [
                'name' => 'Textiles & Fabrics',
                'slug' => 'textiles-fabrics',
                'description' => 'Handwoven textiles, fabrics, and textile art',
                'parent_id' => null,
            ],
            [
                'name' => 'Woodwork',
                'slug' => 'woodwork',
                'description' => 'Handcrafted wooden items and furniture',
                'parent_id' => null,
            ],
            [
                'name' => 'Jewelry',
                'slug' => 'jewelry',
                'description' => 'Handmade jewelry and accessories',
                'parent_id' => null,
            ],
            [
                'name' => 'Metalwork',
                'slug' => 'metalwork',
                'description' => 'Handcrafted metal items and sculptures',
                'parent_id' => null,
            ],
            [
                'name' => 'Leather Goods',
                'slug' => 'leather-goods',
                'description' => 'Handcrafted leather products and accessories',
                'parent_id' => null,
            ],
            [
                'name' => 'Glass Art',
                'slug' => 'glass-art',
                'description' => 'Handblown glass and glass art pieces',
                'parent_id' => null,
            ],
            [
                'name' => 'Paintings & Artwork',
                'slug' => 'paintings-artwork',
                'description' => 'Original paintings and artwork',
                'parent_id' => null,
            ],
            [
                'name' => 'Basketry',
                'slug' => 'basketry',
                'description' => 'Handwoven baskets and woven items',
                'parent_id' => null,
            ],
            [
                'name' => 'Candles & Soaps',
                'slug' => 'candles-soaps',
                'description' => 'Handmade candles and artisanal soaps',
                'parent_id' => null,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $this->command->info('Categories seeded successfully!');
    }
}

