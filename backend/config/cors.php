<?php

// config/cors.php
// Permettre React (localhost:5173) d'appeler Laravel (localhost:8000)

return [
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => ['http://localhost:5173'], // URL Vite React
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => false,
];