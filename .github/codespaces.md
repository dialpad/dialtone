# Github codespaces

If you are part of the Dialpad organziation you have access to GitHub Codespaces, a cloud based development environment that allows you to develop on any device, anywhere, without having to install anything locally. Codespaces may be useful to you in the following cases:

- You do not want to setup a development environment for Dialtone locally.
- You are not a regular Dialtone contributor and you want to make a small change to the codebase.
- You are a non-developer (such as a designer), that still has interest in contributing, perhaps just editing documentation.
- Running / Building locally slows your machine down and you would like to offload the work to a cloud machine.
- You are a regular Dialtone contributor, but you want to try out a feature branch (such as when reviewing a PR) without having to change the context of what you are working on locally.
- You want you share the work you have locally with someone else.
- You are on an alternate device where you do not have your development environment setup locally.

## Getting started

To create a Codespace, click the green "Code" button in the top right of the repository and select "Open with Codespaces".

![Creating a codespace](./new_codespace.png)

This will initialize a new Codespace in your browser for the branch you are currently on. You can also create a Codespace from the [Codespaces dashboard](https://github.com/dialpad/dialtone/codespaces).

Once the codespace boots you will be within a web based VSCode environment. Note that you do not have to use web based VSCode to use Codespaces, but it is the default. It is also possible to run Codespaces in your local IDE. Please see the following docs for more info:

- [VSCode](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-in-visual-studio-code)
- [Jetbrains IDE](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-in-your-jetbrains-ide)

Once the Codespace has finished booting everything is set up and ready to go, including everything you need for developing Dialtone (node, git, pnpm etc). You don't even have to run `pnpm install` as this ran as part of the startup process. How to contribute to Dialtone and how to navigate the repository structure is outside the scope of this document, but you can find more information in the [contributing guide](./CONTRIBUTING.md).

## Running local servers

One of the great benefits of Codespaces is that you can run "local servers" and then make them available to view publically. The ports for the Dialtone docsite, Dialtone storybook for Vue 2 and Vue 3 are already forwarded by default. In order to run these servers, press cmd + shift + p to open the command palette. Select Tasks: Run Task and then start the server you wish by selecting one of the "start" tasks. Note it is possible to start all servers at the same time using the "start: all" task.

You can access servers by clicking the "Ports" tab in the bottom left of the Codespaces window. This will show you the ports that are forwarded and the URLs you can use to access them. You can make any of these URLs publically available by clicking the "Make Public" button.

## Codespace lifecycle

Your codespace will continue to exist until you delete it, or it has been inactive for 30 days. Note that all your work will be saved within an active Codespace even if not committed. If the codespace is deleted without the work being committed however, it will be lost.
