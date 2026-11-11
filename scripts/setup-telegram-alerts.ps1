$ErrorActionPreference = 'Stop'
$repo = 'qaid-u/GLYPH-Studio-ASCII-Art-Motion-Creator'
Write-Host 'First, send /start to your Telegram bot. You will enter tokens privately here, never in chat.'
$secureBot = Read-Host 'Paste your Telegram bot token (input is hidden)' -AsSecureString
$botToken = [System.Net.NetworkCredential]::new('', $secureBot).Password.Trim()
if ($botToken -notmatch '^\d+:[A-Za-z0-9_-]+$') { throw 'Invalid Telegram bot token format.' }
try {
  $updates = Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$botToken/getUpdates" -TimeoutSec 15 -ErrorAction Stop
} catch { throw 'Could not contact Telegram. Check the token and network connection.' }
if (-not $updates.ok) { throw 'Telegram rejected the request.' }
$chats = @($updates.result | Where-Object { $_.message.chat.type -eq 'private' } | ForEach-Object { $_.message.chat } | Sort-Object id -Unique)
if ($chats.Count -eq 0) { throw 'No private conversation found. Open your bot, press Start, then run this setup again. If your bot uses a webhook, getUpdates is unavailable.' }
Write-Host 'Select your Telegram conversation:'
for ($i=0; $i -lt $chats.Count; $i++) { Write-Host ("{0}. {1} {2} (chat ID {3})" -f ($i+1),$chats[$i].first_name,$chats[$i].last_name,$chats[$i].id) }
$choice = Read-Host 'Enter the number for your conversation'
$selection = 0
if (-not [int]::TryParse($choice, [ref]$selection) -or $selection -lt 1 -or $selection -gt $chats.Count) { throw 'No valid conversation was selected.' }
$chatId = [string]$chats[$selection-1].id
Write-Host 'Create a Vercel access token at https://vercel.com/account/tokens with access to the qaid-uqail team.'
$secureVercel = Read-Host 'Paste your Vercel token (input is hidden)' -AsSecureString
$vercelToken = [System.Net.NetworkCredential]::new('', $secureVercel).Password.Trim()
if ([string]::IsNullOrWhiteSpace($vercelToken)) { throw 'Vercel token cannot be empty.' }
try {
  $botToken | gh secret set TELEGRAM_BOT_TOKEN --repo $repo
  if ($LASTEXITCODE -ne 0) { throw 'Could not store Telegram bot token.' }
  $chatId | gh secret set TELEGRAM_CHAT_ID --repo $repo
  if ($LASTEXITCODE -ne 0) { throw 'Could not store Telegram chat ID.' }
  $vercelToken | gh secret set VERCEL_ALERT_TOKEN --repo $repo
  if ($LASTEXITCODE -ne 0) { throw 'Could not store Vercel token.' }
  Write-Host 'Secrets saved. The scheduled monitor remains disabled until a manual test succeeds and it is explicitly enabled.'
} finally {
  $botToken = $null; $vercelToken = $null; $secureBot.Dispose(); $secureVercel.Dispose()
}
