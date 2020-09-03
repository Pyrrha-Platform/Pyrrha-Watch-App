# Prometeo watch app

This repository contains the [Prometeo](https://github.com/Code-and-Response/Prometeo) solution application that targets Samsung watches paired with the [sensor device](https://github.com/Code-and-Response/Prometeo-Firmware) and Samsung [smartphone](https://github.com/Code-and-Response/Prometeo-Mobile-App) carried by the firefighters.

[![License](https://img.shields.io/badge/License-Apache2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Slack](https://img.shields.io/badge/Join-Slack-blue)](https://join.slack.com/t/code-and-response/shared_invite/enQtNzkyMDUyODg1NDU5LTdkZDhmMjJkMWI1MDk1ODc2YTc2OTEwZTI4MGI3NDI0NmZmNTg0Zjg5NTVmYzNiNTYzNzRiM2JkZjYzOWIwMWE)

## Mockup

![Prometeo watch app mockup](img/prometeo-watch-mockups.jpg)

## Features

The watch includes a limited subset of the features proposed in the mockup. It includes:

1. Basic home page
2. On tap, it displays the status of the current sensors

The smartphone is responsible for pairing with the watch and the Prometeo device. The watch receives pushed updates over Bluetooth from the smartphone every second. If any indicator has been red for 5 seconds, it vibrates the watch.

- [x] Basic landing page
- [x] Sensors page
- [ ] [Bluetooth connectivity to smartphone](https://docs.tizen.org/application/web/guides/connectivity/bluetooth/)
- [ ] [Vibrations if any sensor has been red for 5 seconds](https://docs.tizen.org/application/web/guides/notification/notification/#creating-simple-notifications)

## Setting up the solution

* Install Tizen Studio
* Add Samsung SDKs for the watch ([Galaxy Watch 46mm Bluetooth](https://www.samsung.com/es/wearables/galaxy-watch-r800/))

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting Prometeo pull requests.

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.