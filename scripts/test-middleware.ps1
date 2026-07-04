#requires -Version 5.1
function Get-H($h, $k) { if ($h.AllKeys -contains $k) { return $h[$k] } else { return '' } }
function Run-Test($label, $url, $cookieValue, $acceptLang, $expect) {
  $req = [System.Net.HttpWebRequest]::Create($url)
  $req.AllowAutoRedirect = $false
  if ($cookieValue) {
    $req.CookieContainer = New-Object System.Net.CookieContainer
    $req.CookieContainer.Add([System.Uri]::new($url), [System.Net.Cookie]::new('NEXT_LOCALE', $cookieValue, '/', '127.0.0.1'))
  }
  if ($acceptLang) { $req.Headers.Add('Accept-Language', $acceptLang) }
  try {
    $r = $req.GetResponse()
    $loc = Get-H $r.Headers 'Location'
    $sc  = Get-H $r.Headers 'Set-Cookie'
    $rw  = Get-H $r.Headers 'x-middleware-rewrite'
    $code = [int]$r.StatusCode
    $r.Close()
    Write-Host "[$label] $code Loc='$loc' SC='$sc' RW='$rw' -- expected: $expect"
  } catch {
    $we = $_.Exception.InnerException
    if ($we -and $we.Response) {
      $code = [int]$we.Response.StatusCode
      $loc  = Get-H $we.Response.Headers 'Location'
      Write-Host "[$label] $code Loc='$loc' (exception path) -- expected: $expect"
    } else {
      Write-Host "[$label] ERROR: $($_.Exception.Message) -- expected: $expect"
    }
  }
}

Start-Sleep -Seconds 2

Run-Test 'T1' 'http://127.0.0.1:7788/products' 'en' $null '200 no-redirect'
Run-Test 'T2' 'http://127.0.0.1:7788/products' $null 'zh-CN,zh;q=0.9' '307 -> /zh-CN/products'
Run-Test 'T3' 'http://127.0.0.1:7788/products' $null 'en-US,en;q=0.9' '200 no-redirect'
Run-Test 'T4' 'http://127.0.0.1:7788/products' 'zh-CN' $null '307 -> /zh-CN/products'
Run-Test 'T5' 'http://127.0.0.1:7788/zh-CN/products' 'zh-CN' $null '200'
Run-Test 'T6' 'http://127.0.0.1:7788/en/products' 'en' $null '200 (no canonical redirect)'