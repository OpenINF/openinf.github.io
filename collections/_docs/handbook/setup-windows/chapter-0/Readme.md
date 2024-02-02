---
title: Connecting to the Interwebs (Wireless Networking)
category: Documentation
content_type: Install & Setup
published: false
---

<!-- Begin GitHub-Flavored Markdown (GFM)

See: https://docs.github.com/get-started/writing-on-github
Spec: https://github.github.com/gfm

-->

<!-- Not covered: Preparing device for (and installing) host OS --

Windows Server 2016/2022 Standard with Desktop Experience.
Windows Server 2016 Standard is for physical or minimally-virtualized
environments.

See: https://www.microsoft.com/en-us/d/windows-server-2016-standard/dg7gmgf0ds12/0004

-->

Before we can begin using our Windows Server machine as an effective software
development environment, there are a few hurdles to overcome. This chapter deals
with enabling and configuring connectivity to the Internet.

## Access to Wireless Communication

As a safe default &mdash; on fresh installations of Windows Server &mdash;
wireless connectivity (such as Wi-Fi, cellular, and Bluetooth) is still
inaccessible because Airplane mode is enabled.

![image](https://user-images.githubusercontent.com/17770407/227342179-50a79652-193f-4c5c-bab2-a7571e84301d.png)

### Configuring Radio Management Service (RmSvc)[^1]

Airplane mode is also grayed-out/unconfigurable (the default preference of
"enabled" cannot be changed). The following commands must be run in an elevated
Command Line Shell prompt to modify this preference.

The following may be run in Windows Command Prompt (`cmd.exe`), which is
accessible via:

Start -> Windows System -> Command Prompt

```cmd
SC CONFIG RmSvc START= AUTO
```

You should expect to see the following output.

```console
[SC] ChangeServiceConfig SUCCESS
```

### Installing the Wireless Networking Feature

Next, we will be installing a Windows Feature.

The following may be run in PowerShell, which is accessible via

Start -> Windows PowerShell -> Windows PowerShell.

```ps
Install-WindowsFeature -Name Wireless-Networking
```

You should expect to see the following output.

```text
Success Restart Needed Exit Code      Feature Result
------- -------------- ---------      --------------
True    Yes            SuccessRest... {Wireless LAN Service}
WARNING: You must restart this server to finish the installation process.
```

To heed the warning, which indicates that a system reboot will be necessary,
the following command line may be run (using the same PowerShell session should
be alright).

```ps
shutdown –f –r –t 0
```

Once the system has reboot, start the `WlanSvc` service.

### Starting the `WlanSvc` Service

The following may be run in PowerShell, which is accessible via

Start -> Windows PowerShell -> Windows PowerShell.

```ps
Start-Service WlanSvc –PassThru
```

Once this has all been completed, it may be possible that wireless connectivity
is still inaccessible.

<img width="601" alt="we-couldnt-find-wireless-devices-on-this-pc" src="https://user-images.githubusercontent.com/17770407/227344556-df034cfb-a1b4-40e2-aae4-d87b9abf4687.PNG">

The remedy for this is to install the appropriate drivers for the wireless
adapter(s) of your device.

<!--
https://www.intel.com/content/www/us/en/download/19351/windows-10-and-windows-11-wi-fi-drivers-for-intel-wireless-adapters.html
https://support.lenovo.com/us/en/downloads/ds503062-fibocom-l850-gl-wireless-wan-driver-for-windows-10-version-1709-or-later-thinkpad
-->

[^1]: https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/security/windows-services/security-guidelines-for-disabling-system-services-in-windows-server.md#radio-management-service
