# Node.jsのバージョン管理ツールの導入
## Windowsユーザの場合
### 事前準備
node.jsを既にインストールしている場合は一度アンインストールしてください。

### nodistの導入
https://github.com/nullivex/nodist/releasesからNodistSetup-vx.x.x.exeをダウンロード  
（今回はv0.9.1をダウンロードしました）  

### いろいろインストール
- Node.jsのインストール
```
> nodist + 16.11.0
> nodist 16.11.0
```
- npmのバージョン合わせ
```
> nodist npm match
```
- yarnのインストール  
```
npm install -g yarn
```
- gitのインストール  
https://git-scm.com/ここからダウンロードしてインストール  

## Macユーザの場合
nodenvなるものをインストールするらしい。  
ちげくんのScrapBoxを参考にインストールしてください。
https://scrapbox.io/chige12memo/Mac_book_%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89

# 確認
```
> node -v
v16.11.0
> npm -v
8.0.0
> yarn -v
1.22.17
> git --version
git version 2.33.0.windows.2
> npx create-react-app --version
Need to install the following packages:
  create-react-app
Ok to proceed? (y) y
npm WARN deprecated tar@2.2.2: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.
4.0.3
```

# ダウンロード
このリポジトリをクローン
```
git clone https://github.com/CodeParty2021/code_party_front.git
```

# パッケージのインストール
このプロジェクトをクローンした後、プロジェクトルートディレクトリで以下を実行
```
> yarn
```

# ローカルサーバの起動
```
> cd code_party_front
code_party_front > yarn start
http://localhost:3000にアクセスするとReactのページが表示される
```

# Reactプロジェクト作成で実行したコマンド
```
> npx create-react-app code_party_front --template typescript
色々出てくる
最後にHappy hacking!が出てきたらOK
```

# その他、メモ
## nodist関連でなんかエラー出た時
- PATH not updated, original length x > 1024が出た時
 - 環境変数にC:\Program Files (x86)\Nodist\binを追加しましょう．
- cb.apply is not a functionが出た時
 - nodist npm matchを実行しましょう。
- そのほか
 - 頑張って調べて！

## その他、nodistの参考
https://qiita.com/satoyan419/items/56e0b5f35912b9374305

以下、ReactのデフォルトREADME
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
