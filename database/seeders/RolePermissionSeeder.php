<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $verifierRole = Role::firstOrCreate(['name' => 'verifier']);
        $buyerRole = Role::firstOrCreate(['name' => 'buyer']);
        $artisanRole = Role::firstOrCreate(['name' => 'artisan']);

        // Create permissions
        $permissions = [
            'create',
            'read',
            'update',
            'delete',
            'approve',
            'user',
            'role',
            'permission',
            'product',
            'order',
            'category',
            'bid'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define role permissions
        $adminPermissions = [
            'create',
            'read',
            'update',
            'delete',
            'approve',
            'user',
            'role',
            'permission',
            'product',
            'order',
            'category',
            'bid'
        ];

        $verifierPermissions = [
            'read',
            'approve',
            'user',
        ];
        
        $buyerPermissions = [
            'read',
            'create',
            'update',
            'delete',
            'order',
            'product',
            'bid',
        ];
        
        $artisanPermissions = [
            'read',
            'create',
            'update',
            'delete',
            'product',
            'bid',
        ];

        // Attach permissions to roles
        foreach ($adminPermissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if ($permission && !$adminRole->permissions()->where('permission_id', $permission->id)->exists()) {
                $adminRole->permissions()->attach($permission);
            }
        }
        
        foreach ($verifierPermissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if ($permission && !$verifierRole->permissions()->where('permission_id', $permission->id)->exists()) {
                $verifierRole->permissions()->attach($permission);
            }
        }
        
        foreach ($buyerPermissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if ($permission && !$buyerRole->permissions()->where('permission_id', $permission->id)->exists()) {
                $buyerRole->permissions()->attach($permission);
            }
        }
        
        foreach ($artisanPermissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if ($permission && !$artisanRole->permissions()->where('permission_id', $permission->id)->exists()) {
                $artisanRole->permissions()->attach($permission);
            }
        }

        // Create admin user
        $admin = User::updateOrCreate(
            ['email' => 'hakari@gmail.com'],
            [
                'name' => 'Admin',
                'email' => 'hakari@gmail.com',
                'password' => Hash::make('BABAmama-123'),
                'email_verified_at' => now(), // Mark email as verified
            ]
        );
        
        // Create wallet for admin if it doesn't exist
        if (!$admin->wallet) {
            Wallet::create(['user_id' => $admin->id]);
        }
        
        // IMPORTANT: Remove ALL existing roles first (including buyer, artisan, etc.)
        // Then attach only admin role
        DB::table('role_user')->where('user_id', $admin->id)->delete();
        $admin->roles()->attach($adminRole->id);
        
        // Refresh the user to ensure roles are loaded
        $admin->refresh();
        
        // Verify the role was assigned correctly
        if (!$admin->hasRole('admin')) {
            throw new \Exception('Failed to assign admin role to hakari@gmail.com');
        }
    }
}
