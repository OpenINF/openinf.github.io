---
title: Installing Winget
category: Documentation
content_type: Install & Setup
published: false
---

<!-- Begin GitHub-Flavored Markdown (GFM)

See: https://docs.github.com/get-started/writing-on-github
Spec: https://github.github.com/gfm/

-->

Installing Winget[^1] on Windows Server is not as simple as it may sound.

&nbsp;&nbsp;

<https://aka.ms/appinst>

As a URL shorten-er & forwards to the GitHub repo below

<https://github.com/microsoft/winget-cli>

&nbsp;&nbsp;

### Setup

&nbsp;&nbsp;

You will need the following setup to successfully install the MSIX bundle:

&nbsp;&nbsp;

- Windows 10 SDK (version 1809 or above)
- Converted x64 and x86 MSIX packages

&nbsp;&nbsp;

<https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1>

&nbsp;&nbsp;

> Microsoft App Installer for Windows 10 makes sideloading Windows 10 apps easy:
> Just double-click the app package, and you won't have to run PowerShell to
> install apps. App Installer presents the package information like app name,
> publisher, version, display logo, and the capabilities requested by the app.
> Get right into the app, no hassles--and if installation doesn't work, the
> error messages were designed to help you fix the problem. Windows Package
> Manager is supported through App Installer starting on Windows 10 1809. This
> application is currently only available for desktop PCs.

&nbsp;&nbsp;

///NOTE///

> Currently, the Windows server SKUs don’t ship with the Microsoft Store client
> enabled. This creates challenges for updating applications delivered by the
> Microsoft Store. As the Windows Package Manager ships as a part of the Desktop
> App Installer, and that is also not generally default on server SKUs
> [&hellip;]
>
> &mdash;<https://>

<!-- TODO: References? -->

&nbsp;&nbsp;

A version with the Winget tool winds up as a release and MSIX package on GitHub
(since version 1.x). There exists the latest stable and pre-releases:

&nbsp;&nbsp;

| Assets                                                 |
| ------------------------------------------------------ |
| 7bcb1a0ab33340daa57fa5b81faec616_License1.xml          |
| DesktopAppInstallerPolicies.zip                        |
| Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle |
| Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.txt        |

&nbsp;&nbsp;

Refs: <https://github.com/microsoft/winget-cli/releases>

&nbsp;&nbsp;

If you download the MSIXbundle file, you will find that you can’t simply
double-click the file and have it install in Windows Server 2022, as one would
in Windows 10, due to no store availability in Windows Server.

&nbsp;&nbsp;

The reason for this? Microsoft claims that they do not support it, so all of
which follows should be considered as experimental

&nbsp;&nbsp;

However, we can use the `Add-AppxPackage` PowerShell cmdlet to install the
MSIXbundle file.

&nbsp;&nbsp;

When attempting to install MSIXbundle file using this method, there is a slight
hurdle to overcome as there will be errors as shown below.

&nbsp;&nbsp;

> Windows cannot install package
> Microsoft.DesktopAppInstaller_1.19.3132.0_x64\_\_8wekyb3d8bbwe because this
> package depends on a framework that could not be found. Provide the framework
> "Microsoft.UI.Xaml.2.7" published by "CN=Microsoft Corporation, O=Microsoft
> Corporation, L=Redmond, S=Washington, C=US", with neutral or x64 processor
> architecture and minimum version 7.2109.13004.0, along with this package to
> install. The frameworks with name "Microsoft.UI.Xaml.2.7" currently installed
> are: {}

&nbsp;&nbsp;

[^1]: https://learn.microsoft.com/en-us/windows/package-manager/winget/

&nbsp;&nbsp;

`MakeAppx.exe` is a tool available in the Windows 10 SDK that allows for
packaging and bundling of MSIX packages.

&nbsp;&nbsp;

`MakeAppx.exe` can be used to extract the file contents of a Windows 10 app
package or bundle. It also encrypts and decrypts app packages and bundles.

&nbsp;&nbsp;

After the Windows 10 SDK is installed, depending on where it was installed,
`MakeAppx.exe` is usually found here:

&nbsp;&nbsp;

`C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\makeappx.exe`

&nbsp;&nbsp;

Add this directory to your `PATH`

&nbsp;&nbsp;

```powershell
makeappx.exe unbundle /p .\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle /d .\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```

&nbsp;&nbsp;

### Extract packages from the bundle

&nbsp;&nbsp;

1. Run this command:

    **MakeAppx unbundle /p**
    _Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle_ **/d**
    _.\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe_

2. The unpacked bundle has the same structure as the installed package bundle.

&nbsp;&nbsp;

### Extract files from a package

&nbsp;&nbsp;

1. Run this command:

    **MakeAppx unpack /p** _file_ **/d** _output_directory_

2. The unpacked package has the same structure as the installed package.

&nbsp;&nbsp;

```powershell
makeappx.exe unpack /p .\AppInstaller_x64.msix /d .\AppInstaller_64
```

&nbsp;&nbsp;

### Extract Dependencies from the AppxManifest

&nbsp;&nbsp;

```xml
<Dependencies>
  <TargetDeviceFamily Name="Windows.Universal" MinVersion="10.0.17763.0" MaxVersionTested="10.0.25120.0"/>
  <TargetDeviceFamily Name="Windows.Holographic" MinVersion="10.0.20346.0" MaxVersionTested="10.0.22000.0"/>
  <PackageDependency Name="Microsoft.UI.Xaml.2.7" MinVersion="7.2109.13004.0" Publisher="CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US"/>
  <PackageDependency Name="Microsoft.VCLibs.140.00.UWPDesktop" MinVersion="14.0.30704.0" Publisher="CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US"/>
</Dependencies>
```

&nbsp;&nbsp;

We first need to get this package from the store in the appropriate architecture
extract. Using the URL <https://store.rg-adguard.net/>, we can get the download
URL for our component pretty easily to the download URL for our component.

&nbsp;&nbsp;

By the way, you can always find a version in the current Windows Kit. First we
download VC140.00 as Appx package with the following script and install the
package with the `Add-AppPackage` cmdlet. User rights are enough.

&nbsp;&nbsp;

```powershell
# Install-VCLibs.140.00 Version 14.0.30704.0
# Derek Lewis 2022 Derivative Work originally by Andreas Nick 2021

$StoreLink = 'https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1'
$StorePackageName = 'Microsoft.VCLibs.140.00.UWPDesktop_14.0.30704.0_x64__8wekyb3d8bbwe.appx'

$RepoName = 'AppPackages'
$RepoLokation = $env:Temp
$Packagename = 'Microsoft.VCLibs.140.00'
$RepoPath = Join-Path $RepoLokation -ChildPath $RepoName
$RepoPath = Join-Path $RepoPath -ChildPath $Packagename

#
# Function Source
# Idea from: https://serverfault.com/questions/1018220/how-do-i-install-an-app-from-windows-store-using-powershell
# modificated version. Now able to filter and return MSIX URLs.
#

function Download-AppPackage {
[CmdletBinding()]
param (
  [string]$Uri,
  [string]$Filter = '.*' #Regex
)

  process {

    #$Uri=$StoreLink

    $WebResponse = Invoke-WebRequest -UseBasicParsing -Method 'POST' -Uri 'https://store.rg-adguard.net/api/GetFiles' -Body "type=url&url=$Uri&ring=Retail" -ContentType 'application/x-www-form-urlencoded'

    $result =$WebResponse.Links.outerHtml | Where-Object {($_ -like '*.appx*') -or ($_ -like '*.msix*')} | Where-Object {$_ -like '*_neutral_*' -or $_ -like "*_"+$env:PROCESSOR_ARCHITECTURE.Replace("AMD","X").Replace("IA","X")+"_*"} | ForEach-Object {
       $result = "" | Select-Object -Property filename, downloadurl

       if( $_ -match '(?<=rel="noreferrer">).+(?=</a>)' )
       {
         $result.filename = $matches.Values[0]
       }

       if( $_ -match '(?<=a href=").+(?=" r)' )
       {
         $result.downloadurl = $matches.Values[0]
       }
       $result
    }

    $result | Where-Object -Property filename -Match $filter
  }
}

$package = Download-AppPackage -Uri $StoreLink -Filter $StorePackageName

if(-not (Test-Path $RepoPath )) {
    New-Item $RepoPath -ItemType Directory -Force
}

if(-not (Test-Path (Join-Path $RepoPath -ChildPath $package.filename))) {
    Invoke-WebRequest -Uri $($package.downloadurl) -OutFile (Join-Path $RepoPath -ChildPath $package.filename )
} else  {
    Write-Information "The file $($package.filename) already exist in the repo. Skip download"
}

# Install the Runtime
add-AppPackage (Join-Path $RepoPath -ChildPath $package.filename)
```

&nbsp;&nbsp;

```powershell
# Install-Winget Version v1.0.11692
# Derek Lewis 2022 Derivative Work originally by Andreas Nick 2021

# From github
$WinGet_Link = 'https://github.com/microsoft/winget-cli/releases/download/v1.4.3132-preview/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle'
$WinGet_Name = 'Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle'

$RepoName = 'AppPackages'
$RepoLokation = $env:Temp
$Packagename = 'Winget'

$RepoPath = Join-Path $RepoLokation -ChildPath $RepoName
$RepoPath = Join-Path $RepoPath -ChildPath $Packagename

if(-not (Test-Path $RepoPath )) {
    New-Item $RepoPath -ItemType Directory -Force
}

if(-not (Test-Path (Join-Path $RepoPath -ChildPath  $WinGet_Name ))) {
    Invoke-WebRequest -Uri $WinGet_Link -OutFile (Join-Path $RepoPath -ChildPath $WinGet_Name )
} else  {
    Write-Information "The file $WinGet_Name already exist in the repo. Skip download"
}

#Install the Package
Add-AppPackage (Join-Path $RepoPath -ChildPath $WinGet_Name)
```

---

## Acknowledgements

&nbsp;&nbsp;
