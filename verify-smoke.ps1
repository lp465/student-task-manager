# Smoke test for Student Task Manager
$base = 'http://localhost:8080/api'
$ws = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$results = @()

function mark($name,$pass,$detail){
    $results += @{step=$name; pass=$pass; detail=$detail}
    $status = $null
    if ($pass) { $status = 'PASS' } else { $status = 'FAIL' }
    Write-Output ('[' + $status + '] ' + $name + ' - ' + ($detail -as [string]))
}

# 1) Register
$email = "smoketest+" + [int](Get-Date -UFormat %s) + "@example.local"
$regBody = @{ name = "Smoke Tester"; email = $email; password = "Test1234" }
try {
    $r = Invoke-RestMethod -Uri "$base/users/register" -Method Post -Body ($regBody | ConvertTo-Json) -ContentType 'application/json' -WebSession $ws -ErrorAction Stop
    if ($r.success) { mark 'Register' $true "${email}" } else { mark 'Register' $false ($r.message -join ',') }
} catch { mark 'Register' $false $_.Exception.Message }

# 2) Login
$loginBody = @{ email = $email; password = "Test1234" }
$token = $null
try {
    $resp = Invoke-RestMethod -Uri "$base/users/login" -Method Post -Body ($loginBody|ConvertTo-Json) -ContentType 'application/json' -WebSession $ws -ErrorAction Stop
    if ($resp.success -and $resp.data.token) { $token = $resp.data.token; mark 'Login (access token + refresh cookie)' $true "token present" } else { mark 'Login' $false "no token" }
} catch { mark 'Login' $false $_.Exception.Message }

# helper to call API with token
function ApiGet($path){ Invoke-RestMethod -Uri "$base$path" -Method Get -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop }
function ApiPost($path,$body){ Invoke-RestMethod -Uri "$base$path" -Method Post -Body ($body|ConvertTo-Json) -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop }
function ApiPut($path,$body){ Invoke-RestMethod -Uri "$base$path" -Method Put -Body ($body|ConvertTo-Json) -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop }
function ApiDelete($path){ Invoke-RestMethod -Uri "$base$path" -Method Delete -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop }

# 3) Create task
$taskId = $null
try {
    $t = ApiPost('/tasks/create', @{ taskTitle='Smoke task'; description='Smoke test'; priority='MEDIUM'; subject='Testing'; dueDate=(Get-Date).AddDays(3).ToString('yyyy-MM-dd') })
    if ($t.success -and $t.data.id) { $taskId = $t.data.id; mark 'Create task' $true "id=$taskId" } else { mark 'Create task' $false ($t.message) }
} catch { mark 'Create task' $false $_.Exception.Message }

# 4) Update task (edit + mark completed)
try {
    $up = ApiPut("/tasks/update/$taskId", @{ taskTitle='Smoke task edited'; description='edited'; status='COMPLETED' })
    if ($up.success -and $up.data.status -eq 'COMPLETED') { mark 'Update task (mark completed)' $true "status=COMPLETED" } else { mark 'Update task' $false ($up.message) }
} catch { mark 'Update task' $false $_.Exception.Message }

# 5) Fetch tasks (user-specific only)
try {
    $list = Invoke-RestMethod -Uri "$base/tasks" -Method Get -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop
    if ($list.success -and ($list.data -is [System.Collections.IEnumerable])) { mark 'Fetch tasks' $true ("count=" + ($list.data | Measure-Object).Count) } else { mark 'Fetch tasks' $false ($list.message) }
} catch { mark 'Fetch tasks' $false $_.Exception.Message }

# 6) Dashboard analytics loads
try {
    $a = Invoke-RestMethod -Uri "$base/analytics/summary" -Method Get -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop
    if ($a.success) { mark 'Analytics summary' $true "ok" } else { mark 'Analytics summary' $false ($a.message) }
} catch { mark 'Analytics summary' $false $_.Exception.Message }

# 7) Refresh page (simulate persistent session via refresh cookie):
# Invalidate token locally then call /users/refresh to get new token
try {
    $old = $token
    $token = 'invalid-token-forcing-refresh'
    # call /tasks to force 401
    try { Invoke-RestMethod -Uri "$base/tasks" -Method Get -Headers @{ Authorization = "Bearer $token" } -WebSession $ws -ErrorAction Stop; $forced = $true } catch { $forced = $false }
    if (-not $forced) {
        # request refresh
        $r = Invoke-RestMethod -Uri "$base/users/refresh" -Method Post -WebSession $ws -ErrorAction Stop
        if ($r.success -and $r.data.token) { $token = $r.data.token; mark 'Refresh token flow' $true "new access token obtained" } else { $token = $old; mark 'Refresh token flow' $false "no token" }
    } else { $token = $old; mark 'Refresh token flow' $false "unexpected success with invalid token" }
} catch { mark 'Refresh token flow' $false $_.Exception.Message }

# 8) Logout (clears session + refresh cookie)
try {
    $lo = Invoke-RestMethod -Uri "$base/users/logout" -Method Post -WebSession $ws -ErrorAction Stop
    if ($lo.success) { mark 'Logout' $true "ok" } else { mark 'Logout' $false ($lo.message) }
} catch { mark 'Logout' $false $_.Exception.Message }

# 9) After logout: API calls must fail (401 expected for refresh endpoint)
try {
    try { $r2 = Invoke-RestMethod -Uri "$base/users/refresh" -Method Post -WebSession $ws -ErrorAction Stop; $postLogoutRefresh = $true } catch { $postLogoutRefresh = $false }
    if (-not $postLogoutRefresh) { mark 'Post-logout refresh' $true "refresh cookie cleared" } else { mark 'Post-logout refresh' $false "refresh still usable" }
} catch { mark 'Post-logout refresh' $false $_.Exception.Message }

Write-Output "`nSummary:`"
$results | ForEach-Object { Write-Output ($_.step + ': ' + ($_.pass -as [string]) + ' - ' + ($_.detail -as [string])) }

# Exit with non-zero if any fail
if ($results | Where-Object { -not $_.pass }) { exit 1 } else { exit 0 }
