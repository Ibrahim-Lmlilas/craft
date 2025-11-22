<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            color: white;
        }
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>Successfully authenticated!</h2>
        <p>Redirecting to dashboard...</p>
    </div>

    <script>
        // Store user data in localStorage for frontend to pick up
        @if(isset($user))
        try {
            localStorage.setItem('google_auth_user', JSON.stringify({
                id: '{{ $user->id }}',
                name: '{{ $user->name }}',
                email: '{{ $user->email }}',
                roles: @json($user->roles)
            }));
        } catch (e) {
            console.error('Failed to store user data:', e);
        }
        @endif

        // Determine redirect URL based on user role
        @if(isset($user))
        const userRoles = @json($user->roles ?? []);
        const isAdmin = userRoles.some(role => role.name === 'admin');
        const redirectUrl = isAdmin ? '{{ str_replace('/dashboard', '/admin', $redirectUrl) }}' : '{{ $redirectUrl }}';
        @else
        const redirectUrl = '{{ $redirectUrl }}';
        @endif

        // Redirect to frontend
        window.location.href = redirectUrl;
    </script>
</body>
</html>

