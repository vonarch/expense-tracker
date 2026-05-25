# Run as Administrator: Right-click PowerShell → Run as administrator, then:
#   cd path\to\expense-tracker\backend\scripts
#   .\open-firewall.ps1

$ruleName = 'Expense Tracker API (Port 5000)'

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Firewall rule already exists."
  exit 0
}

New-NetFirewallRule `
  -DisplayName $ruleName `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 5000 `
  -Action Allow `
  -Profile Private,Public

Write-Host "Firewall rule added. Your phone can now reach the backend on port 5000."
