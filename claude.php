<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Restrict this in production

$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

$payload = [
    'model' => 'claude-sonnet-4-20250514',
    'max_tokens' => 1024,
    'messages' => [
        ['role' => 'user', 'content' => $userMessage]
    ]
];

$ch = curl_init('https://api.anthropic.com/v1/messages');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . ${{ secrets.CLAUDE_API_KEY }},
        'anthropic-version: 2023-06-01'
    ]
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
