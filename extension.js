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
          cancellable: false,
        },
        (progress, token) => {
          const rcsoutput = vscode.window.createOutputChannel("auto-tinypng");
          rcsoutput.show();
          const tiny = new TinyPng(args.path, true, progress, rcsoutput);

          const p = tiny.compress().then(() => {
            if (!tiny.config.files.length) {
              vscode.window.showInformationMessage(
                `此文件夹无符合条件的图片（大于20k，小于5MB），无需压缩`
              );
              return;
            }

            vscode.window.showInformationMessage(
              `图片压缩完毕: 成功: ${tiny.successCount}张, 成功率${
                (tiny.successCount / tiny.config.files.length) * 100
              }%`
            );
          });
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
