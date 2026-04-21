<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Restrict this in production
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

$apiKey = getenv('CHAT_KEY');
if (!$apiKey) {
    die('Error: CHAT_KEY environment variable not set');
}

$data = [
    'model' => 'claude-sonnet-4-20250514',
    'max_tokens' => 1024,
    'messages' => [
        [
            'role' => 'user',
            'content' => $userMessage
        ]
    ]
];

$ch = curl_init('https://api.anthropic.com/v1/messages');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($data),
    CURLOPT_HTTPHEADER     => [
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
        'content-type: application/json'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode === 200) {
    echo $result['content'][0]['text'];
} else {
    echo 'Error ' . $httpCode . ': ' . $result['error']['message'];
}

?>
