// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const TinyPng = require("./lib/bundle");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-auto-tinypng" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "vscode-auto-tinypng.compress",
    function (args) {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      //   vscode.window.showInformationMessage(
      //     "Hello World from vscode-auto-tinypng!"
      //   );
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "图片压缩中",
          cancellable: true,
        },
        (progress, token) => {
          const tiny = new TinyPng(args.path, true, progress);

          const p = tiny.compress();
          token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
            tiny.stop = true;
          });

          return p;
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
